/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Employee {
  ID: number;
  Name: string;
  Age: number;
  Gender: string;
  Department: string;
  Salary: number;
  JoiningDate: string;
  PerformanceScore: number; // 1-5, nulls default/imputed to 3
  Experience: number; // years
  Status: string; // Active / Inactive
  Location: string;
  Session: string;
}

export interface Criterion {
  id: string;
  name: string;
  type: "benefit" | "cost";
  description: string;
}

export interface AHPResult {
  matrix: number[][];
  normalMatrix: number[][];
  weights: number[];
  lambdaMax: number;
  ci: number;
  cr: number;
  isConsistent: boolean;
}

export interface TOPSISResultItem {
  employee: Employee;
  c1_value: number; // original performance score (imputed)
  c2_value: number; // original experience
  c3_value: number; // original salary
  c4_value: number; // original age
  r_c1: number; // normalized performance score
  r_c2: number; // normalized experience
  r_c3: number; // normalized salary
  r_c4: number; // normalized age
  v_c1: number; // weighted performance score
  v_c2: number; // weighted experience
  v_c3: number; // weighted salary
  v_c4: number; // weighted age
  dPlus: number;  // separation from ideal positive
  dMinus: number; // separation from ideal negative
  preferenceWeight: number; // P_i
  rank?: number;
}

export interface TOPSISDetails {
  items: TOPSISResultItem[];
  idealPositive: number[]; // A+ for c1, c2, c3, c4
  idealNegative: number[]; // A- for c1, c2, c3, c4
}
