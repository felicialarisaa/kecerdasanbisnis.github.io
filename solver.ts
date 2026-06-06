/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Employee, AHPResult, TOPSISResultItem, TOPSISDetails } from "./types";
import { RAW_EMPLOYEE_CSV } from "./employeeData";

// Parse raw CSV content into typed Employee records
export function parseEmployeeData(): Employee[] {
  const lines = RAW_EMPLOYEE_CSV.trim().split("\n");
  const headers = lines[0].split(",").map(h => h.trim());
  
  return lines.slice(1).map(line => {
    const values = line.split(",").map(v => v.trim());
    const obj: any = {};
    
    headers.forEach((header, index) => {
      let val: any = values[index];
      if (val === "" || val === undefined) {
        val = null;
      }
      obj[header] = val;
    });

    // Map fields and handle conversions
    const id = Number(obj["ID"]);
    const age = Number(obj["Age"]);
    const salary = Number(obj["Salary"]);
    const experience = Number(obj["Experience"]);
    
    // Performance score handle: Impute nulls / empty spaces with moderate score 3.0
    let performance = obj["Performance Score"];
    if (performance === null || performance === "null" || isNaN(Number(performance))) {
      performance = 3.0; // Moderate neutral baseline
    } else {
      performance = Number(performance);
    }

    return {
      ID: id,
      Name: obj["Name"] || `Karyawan #${id}`,
      Age: age,
      Gender: obj["Gender"] || "Other",
      Department: obj["Department"] || "IT",
      Salary: salary,
      JoiningDate: obj["Joining Date"] || "2020-01-01",
      PerformanceScore: performance,
      Experience: experience,
      Status: obj["Status"] || "Inactive",
      Location: obj["Location"] || "Chicago",
      Session: obj["Session"] || "Morning"
    };
  });
}

// Map of random index (RI) table for AHP
const RI_TABLE: Record<number, number> = {
  1: 0.00,
  2: 0.00,
  3: 0.58,
  4: 0.90,
  5: 1.12,
  6: 1.24,
  7: 1.32,
  8: 1.41,
  9: 1.45,
  10: 1.49
};

// Calculate AHP Weights and Consistency
export function calculateAHP(sliders: {
  comp_0_1: number;
  comp_0_2: number;
  comp_0_3: number;
  comp_1_2: number;
  comp_1_3: number;
  comp_2_3: number;
}): AHPResult {
  const n = 4;
  const matrix = Array(n).fill(null).map(() => Array(n).fill(1));

  // Helper to interpret pairwise scale sliders
  // Value >= 1, meaning x is more important than y.
  // Value < 1 (negative), y is more important than x.
  const decodeSliderValue = (val: number) => {
    if (val >= 1) return val;
    return 1 / Math.abs(val);
  };

  // 0: Performance, 1: Experience, 2: Salary, 3: Age
  // C0 vs C1
  matrix[0][1] = decodeSliderValue(sliders.comp_0_1);
  matrix[1][0] = 1 / matrix[0][1];

  // C0 vs C2
  matrix[0][2] = decodeSliderValue(sliders.comp_0_2);
  matrix[2][0] = 1 / matrix[0][2];

  // C0 vs C3
  matrix[0][3] = decodeSliderValue(sliders.comp_0_3);
  matrix[3][0] = 1 / matrix[0][3];

  // C1 vs C2
  matrix[1][2] = decodeSliderValue(sliders.comp_1_2);
  matrix[2][1] = 1 / matrix[1][2];

  // C1 vs C3
  matrix[1][3] = decodeSliderValue(sliders.comp_1_3);
  matrix[3][1] = 1 / matrix[1][3];

  // C2 vs C3
  matrix[2][3] = decodeSliderValue(sliders.comp_2_3);
  matrix[3][2] = 1 / matrix[2][3];

  // Sum Column values
  const colSums = Array(n).fill(0);
  for (let j = 0; j < n; j++) {
    for (let i = 0; i < n; i++) {
      colSums[j] += matrix[i][j];
    }
  }

  // Normalization
  const normalMatrix = Array(n).fill(null).map(() => Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      normalMatrix[i][j] = matrix[i][j] / colSums[j];
    }
  }

  // Row mean = Priority Vector (Weights)
  const weights = Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    let rowSum = 0;
    for (let j = 0; j < n; j++) {
      rowSum += normalMatrix[i][j];
    }
    weights[i] = rowSum / n;
  }

  // Consistency check: A x w
  const weightedSum = Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      weightedSum[i] += matrix[i][j] * weights[j];
    }
  }

  // Calculate ratios vector (Lambda terms)
  const ratios = Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    ratios[i] = weightedSum[i] / weights[i];
  }

  // Compute stats
  const lambdaMax = ratios.reduce((sum, val) => sum + val, 0) / n;
  const ci = (lambdaMax - n) / (n - 1);
  const ri = RI_TABLE[n] || 0.90;
  const cr = ri === 0 ? 0 : ci / ri;
  const isConsistent = cr < 0.1;

  return {
    matrix,
    normalMatrix,
    weights,
    lambdaMax,
    ci,
    cr,
    isConsistent
  };
}

// Calculate TOPSIS based on employee dataset and criterion weights
export function calculateTOPSIS(
  employees: Employee[],
  weights: number[] // Size 4 (C1, C2, C3, C4)
): TOPSISDetails {
  if (employees.length === 0) {
    return { items: [], idealPositive: [0, 0, 0, 0], idealNegative: [0, 0, 0, 0] };
  }

  // Criteria identifiers:
  // C1: PerformanceScore (Benefit)
  // C2: Experience (Benefit)
  // C3: Salary (Cost) -> Minimized for financial efficiency
  // C4: Age (Cost) -> Younger age favored for long-term retention potential

  // Step 1: Calculate quadratic sums for normalisation
  let sumSq_c1 = 0;
  let sumSq_c2 = 0;
  let sumSq_c3 = 0;
  let sumSq_c4 = 0;

  employees.forEach(emp => {
    sumSq_c1 += emp.PerformanceScore * emp.PerformanceScore;
    sumSq_c2 += emp.Experience * emp.Experience;
    sumSq_c3 += emp.Salary * emp.Salary;
    sumSq_c4 += emp.Age * emp.Age;
  });

  const divider_c1 = Math.sqrt(sumSq_c1) || 1;
  const divider_c2 = Math.sqrt(sumSq_c2) || 1;
  const divider_c3 = Math.sqrt(sumSq_c3) || 1;
  const divider_c4 = Math.sqrt(sumSq_c4) || 1;

  // Step 2 & 3: Normalization and weight weighting
  // Generate intermediate values
  const items: TOPSISResultItem[] = employees.map(emp => {
    const r_c1 = emp.PerformanceScore / divider_c1;
    const r_c2 = emp.Experience / divider_c2;
    const r_c3 = emp.Salary / divider_c3;
    const r_c4 = emp.Age / divider_c4;

    const v_c1 = r_c1 * weights[0];
    const v_c2 = r_c2 * weights[1];
    const v_c3 = r_c3 * weights[2];
    const v_c4 = r_c4 * weights[3];

    return {
      employee: emp,
      c1_value: emp.PerformanceScore,
      c2_value: emp.Experience,
      c3_value: emp.Salary,
      c4_value: emp.Age,
      r_c1, r_c2, r_c3, r_c4,
      v_c1, v_c2, v_c3, v_c4,
      dPlus: 0,
      dMinus: 0,
      preferenceWeight: 0
    };
  });

  // Step 4: Determine positive and negative solutions:
  // C1 (Performance) -> Max is positive, Min is negative
  // C2 (Experience) -> Max is positive, Min is negative
  // C3 (Salary) -> Min is positive (Cost), Max is negative
  // C4 (Age) -> Min is positive (Cost), Max is negative

  const max_v1 = Math.max(...items.map(item => item.v_c1));
  const min_v1 = Math.min(...items.map(item => item.v_c1));

  const max_v2 = Math.max(...items.map(item => item.v_c2));
  const min_v2 = Math.min(...items.map(item => item.v_c2));

  const max_v3 = Math.max(...items.map(item => item.v_c3));
  const min_v3 = Math.min(...items.map(item => item.v_c3));

  const max_v4 = Math.max(...items.map(item => item.v_c4));
  const min_v4 = Math.min(...items.map(item => item.v_c4));

  // Positive Ideal Solutions vector (A+)
  const idealPositive = [
    max_v1, // Benefit
    max_v2, // Benefit
    min_v3, // Cost (Lower is Ideal)
    min_v4  // Cost (Lower is Ideal)
  ];

  // Negative Ideal Solutions vector (A-)
  const idealNegative = [
    min_v1, // Benefit
    min_v2, // Benefit
    max_v3, // Cost (Higher is Worse)
    max_v4  // Cost (Higher is Worse)
  ];

  // Step 5 & 6: Calculate Euclidean separation distances D+ and D-, and preference weight P_i
  items.forEach(item => {
    const dPlus = Math.sqrt(
      Math.pow(item.v_c1 - idealPositive[0], 2) +
      Math.pow(item.v_c2 - idealPositive[1], 2) +
      Math.pow(item.v_c3 - idealPositive[2], 2) +
      Math.pow(item.v_c4 - idealPositive[3], 2)
    );

    const dMinus = Math.sqrt(
      Math.pow(item.v_c1 - idealNegative[0], 2) +
      Math.pow(item.v_c2 - idealNegative[1], 2) +
      Math.pow(item.v_c3 - idealNegative[2], 2) +
      Math.pow(item.v_c4 - idealNegative[3], 2)
    );

    const preferenceWeight = (dPlus + dMinus) === 0 ? 0 : dMinus / (dPlus + dMinus);

    item.dPlus = dPlus;
    item.dMinus = dMinus;
    item.preferenceWeight = preferenceWeight;
  });

  // Sort by preference weight in descending order to assign ranks
  const sortedItems = [...items].sort((a, b) => b.preferenceWeight - a.preferenceWeight);
  sortedItems.forEach((item, index) => {
    item.rank = index + 1;
  });

  return {
    items: sortedItems,
    idealPositive,
    idealNegative
  };
}
