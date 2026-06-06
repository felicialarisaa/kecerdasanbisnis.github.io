/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Authentic Kaggle dataset subset (First 120 lines) to avoid generation limits.
 */

export const RAW_EMPLOYEE_CSV = `ID,Name,Age,Gender,Department,Salary,Joining Date,Performance Score,Experience,Status,Location,Session
1,Cory Escobar,48,Female,HR,5641,2015-05-03,2.0,16,Active,New York,Night
2,Timothy Sanchez,25,Other,Sales,4249,2020-11-09,2.0,11,Inactive,Los Angeles,Evening
3,Chad Nichols,57,Other,Sales,3058,2019-02-12,,1,Inactive,New York,Morning
4,Christine Williams,58,Female,IT,5895,2017-09-08,2.0,13,Inactive,Los Angeles,Evening
5,Amber Harris,35,Other,IT,4317,2020-02-15,5.0,16,Inactive,New York,Evening
6,Ashley Howe,29,Female,HR,2591,2016-06-24,1.0,6,Active,Chicago,Evening
7,David Olson,39,Female,Sales,6826,2023-05-11,,4,Active,New York,Night
8,Amanda Baker,52,Other,HR,6285,2015-04-01,,8,Inactive,Chicago,Evening
9,Jeremy Wright,63,Female,Sales,9862,2024-02-07,,3,Inactive,New York,Night
10,Brian Faulkner,30,Male,IT,8202,2018-05-26,1.0,9,Active,Los Angeles,Morning
11,Nicole Bell,42,Female,Sales,5336,2015-01-28,3.0,7,Active,Los Angeles,Evening
12,Rodney Richardson,60,Other,HR,6908,2015-03-14,4.0,19,Active,Chicago,Night
13,Joshua Robinson,61,Male,IT,5688,2020-06-21,,4,Inactive,Chicago,Night
14,Benjamin Callahan,34,Male,IT,5593,2019-06-23,,2,Inactive,Los Angeles,Night
15,Matthew Collins MD,31,Female,Sales,8568,2020-06-01,,20,Inactive,Los Angeles,Evening
16,Gary Cooley,62,Male,HR,5386,2017-07-25,,2,Inactive,Chicago,Morning
17,Jonathan Perez,59,Male,HR,6586,2019-02-19,3.0,7,Inactive,Los Angeles,Evening
18,Jacqueline Randall,31,Female,HR,3519,2018-05-18,4.0,6,Active,New York,Morning
19,Nancy Stephens,38,Male,HR,9061,2017-07-16,5.0,16,Inactive,Chicago,Night
20,Victoria Fox,57,Female,HR,7251,2023-06-07,,10,Active,Los Angeles,Evening
21,Heather Jones,35,Male,Sales,4565,2018-02-07,,9,Active,Chicago,Night
22,Stacie Porter,61,Female,HR,4071,2020-05-04,2.0,9,Inactive,Chicago,Night
23,Bryce Carter,35,Female,Sales,9598,2015-12-16,4.0,4,Inactive,New York,Night
24,Marissa Stewart,31,Female,HR,5386,2021-01-30,,3,Active,Los Angeles,Evening
25,Tracy Carlson,21,Male,HR,9275,2022-04-09,4.0,12,Active,New York,Morning
26,Tara Blackwell,30,Other,HR,6120,2020-02-20,5.0,7,Active,New York,Evening
27,Austin Long,20,Female,IT,4899,2024-05-01,5.0,8,Inactive,Chicago,Night
28,Jordan Warren,55,Female,HR,4608,2018-07-07,,18,Inactive,Los Angeles,Morning
29,Vickie Campbell,65,Female,IT,9190,2019-10-28,,12,Inactive,Chicago,Morning
30,Rachel Ramsey,22,Male,Sales,9661,2016-08-18,2.0,17,Inactive,Chicago,Night
31,Brandi Smith,21,Other,IT,4780,2020-01-20,1.0,7,Inactive,New York,Night
32,Jacqueline Becker,63,Other,Sales,4270,2021-12-16,,20,Inactive,Los Angeles,Morning
33,Trevor Duncan,65,Other,Sales,6547,2024-06-10,,10,Active,Chicago,Evening
34,Mr. Brian Nelson,42,Female,IT,5207,2017-08-17,1.0,4,Active,Los Angeles,Night
35,Lisa Fry,51,Female,IT,9259,2017-09-26,4.0,17,Inactive,Los Angeles,Night
36,Kevin Watts,35,Male,IT,9078,2019-06-12,1.0,7,Inactive,Los Angeles,Evening
37,Jacqueline Moore,39,Male,Sales,2364,2018-02-25,1.0,15,Active,Los Angeles,Evening
38,Lawrence Rose,18,Female,HR,2904,2021-04-11,1.0,17,Inactive,Chicago,Night
39,Jordan Scott,33,Other,Sales,8678,2016-05-15,5.0,9,Active,Los Angeles,Evening
40,Lisa Wagner,36,Male,HR,8870,2024-08-12,4.0,17,Active,Los Angeles,Evening
41,Ricky Keith,20,Female,Sales,6621,2024-01-29,,20,Inactive,Los Angeles,Evening
42,Charles Mccall,58,Other,IT,9512,2024-11-10,,8,Inactive,Los Angeles,Morning
43,April Ponce,27,Female,Sales,6655,2021-10-22,,2,Inactive,Los Angeles,Evening
44,Cindy Nichols,64,Female,IT,2427,2014-12-19,,6,Active,New York,Night
45,Daniel Aguirre,20,Other,IT,4184,2017-10-03,,13,Active,New York,Morning
46,Dr. Monica Hanna PhD,27,Other,HR,4356,2020-10-31,,11,Inactive,New York,Night
47,Alicia Scott,47,Female,HR,7966,2019-09-03,,8,Inactive,New York,Morning
48,Jake Johnson,48,Other,IT,5848,2017-02-03,3.0,2,Active,Los Angeles,Night
49,Jamie Wood,46,Male,Sales,2773,2023-02-25,4.0,9,Active,New York,Morning
50,Valerie Guerrero,23,Male,HR,6253,2023-09-21,4.0,14,Active,Los Angeles,Night
51,Jamie Gregory,27,Other,Sales,3253,2015-12-07,,12,Active,Chicago,Morning
52,Jesse Vincent,62,Male,HR,6149,2023-09-17,,11,Inactive,Chicago,Evening
53,Steve Salinas,42,Other,Sales,6567,2022-03-26,2.0,19,Inactive,Los Angeles,Morning
54,Taylor Griffin,62,Other,Sales,5721,2019-01-07,5.0,7,Active,Chicago,Night
55,Kim Smith,63,Other,HR,4533,2023-10-11,4.0,16,Active,Los Angeles,Night
56,Jonathon Adams,40,Female,IT,8745,2020-07-29,,12,Inactive,Chicago,Night
57,Jeremy Conway,38,Other,IT,4954,2024-08-11,,12,Active,Los Angeles,Night
58,Johnathan Obrien,58,Female,Sales,3635,2021-04-09,,7,Active,New York,Night
59,Erik Moss,57,Male,Sales,4651,2018-02-07,,19,Active,Los Angeles,Night
60,Melinda Tyler,19,Other,Sales,5937,2021-04-12,5.0,9,Inactive,Los Angeles,Evening
61,Andrew Shannon,51,Other,Sales,8544,2020-02-08,,6,Active,New York,Evening
62,Carmen Taylor,33,Male,Sales,2851,2023-01-30,2.0,11,Active,Chicago,Morning
63,Joseph Anderson,57,Female,IT,3933,2023-06-02,,6,Active,Los Angeles,Night
64,Katherine Clark,39,Female,IT,2585,2023-02-17,2.0,1,Active,Los Angeles,Evening
65,Mary Miller,20,Other,Sales,3718,2019-10-19,,4,Active,Los Angeles,Morning
66,Sarah Harrell,44,Male,IT,2436,2021-01-01,,5,Inactive,Chicago,Night
67,Kelli Lopez,25,Female,HR,7637,2021-09-21,,4,Active,Los Angeles,Night
68,Denise Smith,27,Male,HR,6921,2024-10-31,2.0,3,Active,Chicago,Evening
69,Alyssa Taylor,29,Male,HR,7554,2017-10-19,,17,Active,Chicago,Night
70,Erica James,64,Female,IT,2442,2020-09-28,,14,Inactive,Los Angeles,Morning
71,Daniel Hamilton,40,Male,Sales,2466,2018-04-08,,15,Active,Chicago,Evening
72,Tiffany Alexander,45,Female,Sales,3897,2019-05-18,4.0,12,Active,Chicago,Evening
73,Jennifer Carter,52,Male,HR,8386,2016-04-06,,14,Active,Chicago,Morning
74,Amanda Rodgers,60,Male,IT,3767,2018-03-21,3.0,3,Inactive,Los Angeles,Night
75,Francisco Jones,18,Female,Sales,8622,2023-07-01,1.0,13,Inactive,Chicago,Evening
76,Cameron Butler,31,Female,IT,8032,2023-10-20,4.0,11,Inactive,New York,Morning
77,Victor Nelson,47,Female,Sales,2025,2015-05-14,1.0,5,Active,New York,Night
78,Kathy Thompson,19,Other,HR,4698,2016-02-23,3.0,15,Inactive,Chicago,Night
79,Michele Schmidt,56,Male,HR,5457,2016-05-22,,11,Inactive,Chicago,Evening
80,Mary Singh,39,Other,IT,5562,2019-07-06,,7,Inactive,New York,Evening
81,Julia Stanley,28,Female,HR,2077,2021-07-28,,11,Inactive,Los Angeles,Morning
82,Kevin Price,62,Male,HR,4292,2020-11-12,2.0,7,Active,Los Angeles,Night
83,Jamie Wright,49,Other,Sales,3111,2020-11-02,,3,Active,Chicago,Evening
84,Elaine Payne,18,Female,IT,5470,2017-06-23,3.0,8,Active,Los Angeles,Evening
85,Justin Rodriguez,39,Other,Sales,3115,2020-07-01,4.0,4,Active,Chicago,Evening
86,Chase Taylor,29,Other,IT,9901,2017-10-04,2.0,7,Active,Los Angeles,Evening
87,Dustin Allen,34,Male,IT,8629,2015-01-08,,9,Inactive,Chicago,Morning
88,Lori Bowen,28,Female,Sales,6839,2023-01-07,,4,Active,Los Angeles,Evening
89,Jessica Sanders,41,Male,HR,6828,2024-08-02,1.0,10,Inactive,Chicago,Night
90,Lauren Lee,60,Female,Sales,8710,2020-07-16,2.0,10,Inactive,Los Angeles,Evening
91,Kyle Schwartz,31,Male,HR,3488,2023-03-16,1.0,3,Active,New York,Morning
92,Bruce Campbell,58,Other,IT,5271,2023-12-20,,7,Active,Chicago,Night
93,Peter Moore,38,Other,Sales,4897,2021-03-13,1.0,4,Inactive,Chicago,Morning
94,Elizabeth Gallagher,21,Female,IT,2860,2023-02-06,4.0,4,Active,Los Angeles,Night
95,Michael Garcia,62,Male,Sales,3482,2018-01-29,3.0,20,Active,New York,Night
96,Jeff Wilson,45,Other,HR,3427,2024-06-08,,8,Active,Chicago,Evening
97,Holly Gaines,22,Male,Sales,5432,2017-01-14,,14,Inactive,Los Angeles,Morning
98,Matthew Fields,33,Female,HR,2378,2015-08-07,,20,Inactive,Los Angeles,Night
99,Kathleen Thomas,20,Other,IT,6768,2018-09-15,,2,Inactive,Los Angeles,Night
100,Thomas Hamilton,33,Male,Sales,8076,2017-12-24,,9,Inactive,Chicago,Morning
101,Bryan Navarro,26,Female,IT,9538,2021-01-23,,3,Active,New York,Morning
102,Jennifer Hansen,27,Other,HR,2912,2020-02-22,2.0,3,Inactive,New York,Night
103,James Saunders,34,Other,IT,6742,2019-09-16,,8,Active,Los Angeles,Night
104,Jose Henson,32,Male,HR,6458,2023-03-25,5.0,7,Active,Chicago,Evening
105,Isaiah Sanders DDS,31,Female,HR,2752,2021-04-28,5.0,6,Active,Chicago,Night
106,Katelyn Chavez,25,Other,HR,7371,2015-10-06,,13,Inactive,Chicago,Evening
107,Nancy Robinson,21,Other,Sales,5133,2017-12-19,,11,Active,Los Angeles,Evening
108,Sandra Allen,24,Male,IT,2578,2019-01-05,5.0,16,Active,Chicago,Morning
109,Mrs. Robin Mccarthy PhD,51,Male,HR,7457,2019-04-24,,15,Active,Los Angeles,Night
110,Catherine Ray,58,Female,Sales,7263,2017-12-10,,20,Active,New York,Morning
111,James Johnson,65,Female,HR,2166,2016-08-20,2.0,17,Inactive,New York,Morning
112,Sarah Barrera,31,Female,Sales,2303,2021-10-30,3.0,18,Inactive,Los Angeles,Night
113,Luke Mcpherson,34,Other,IT,9812,2016-01-29,3.0,13,Active,New York,Evening
114,Michael Moore,65,Other,Sales,4940,2021-03-26,2.0,11,Active,Los Angeles,Evening
115,Donna Manning,40,Other,IT,3935,2021-05-10,5.0,19,Inactive,Chicago,Morning
116,John Lloyd,19,Male,HR,3233,2017-05-10,5.0,6,Inactive,Chicago,Evening
117,Sean Owens,45,Male,HR,4012,2016-07-09,,10,Inactive,Los Angeles,Night
118,Gregory Robinson,32,Other,IT,8619,2021-01-16,,8,Inactive,New York,Morning
119,Tara Hudson,48,Female,IT,2898,2022-01-02,,12,Inactive,Los Angeles,Morning
120,Heidi Franklin,22,Male,HR,7187,2024-01-26,,1,Active,New York,Morning`;
