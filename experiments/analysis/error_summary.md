# Error event summary

Supplementary diagnostic evidence about failure modes -- **not** a primary outcome metric. error_category/error_subcategory below are the Phase-3 RECLASSIFIED values (172 events reclassified away from 'unknown'); the original, unmodified classification from error_events.csv is preserved in error_category_original/error_subcategory_original. See experiments/README.md for the two rate denominators (events_per_function, events_per_attempt).

## Most common failure modes by model x strategy

| model | strategy | phase | error_category | error_subcategory | event_count | rank |
| --- | --- | --- | --- | --- | --- | --- |
| falcon_7b | few_shot | jest | jest | test_discovery_failure | 63 | 1 |
| falcon_7b | few_shot | repair | repair | unparseable_failure | 50 | 2 |
| falcon_7b | few_shot | pipeline | pipeline | rollback | 13 | 3 |
| falcon_7b | few_shot | repair | repair | max_repairs_exceeded | 13 | 4 |
| falcon_7b | few_shot | jest | jest | unknown | 5 | 5 |
| falcon_7b | structured | jest | jest | runtime_error | 65 | 1 |
| falcon_7b | structured | jest | jest | unknown | 26 | 2 |
| falcon_7b | structured | jest | jest | assertion_failure | 21 | 3 |
| falcon_7b | structured | repair | repair | repair_failed | 12 | 4 |
| falcon_7b | structured | jest | jest | unexpected_throw | 8 | 5 |
| falcon_7b | zero_shot | jest | jest | test_discovery_failure | 22 | 1 |
| falcon_7b | zero_shot | repair | repair | unparseable_failure | 21 | 2 |
| falcon_7b | zero_shot | jest | jest | runtime_error | 20 | 3 |
| falcon_7b | zero_shot | jest | jest | assertion_failure | 17 | 4 |
| falcon_7b | zero_shot | jest | jest | unexpected_throw | 8 | 5 |
| gemma_4 | few_shot | jest | jest | unknown | 13 | 1 |
| gemma_4 | few_shot | jest | jest | assertion_failure | 6 | 2 |
| gemma_4 | few_shot | jest | jest | runtime_error | 3 | 3 |
| gemma_4 | few_shot | jest | jest | unexpected_throw | 3 | 4 |
| gemma_4 | few_shot | generation | generation | invalid_output | 2 | 5 |
| gemma_4 | structured | jest | jest | unknown | 30 | 1 |
| gemma_4 | structured | jest | jest | assertion_failure | 23 | 2 |
| gemma_4 | structured | jest | jest | runtime_error | 7 | 3 |
| gemma_4 | structured | repair | repair | repair_failed | 4 | 4 |
| gemma_4 | structured | jest | jest | unexpected_throw | 3 | 5 |
| gemma_4 | zero_shot | jest | jest | runtime_error | 53 | 1 |
| gemma_4 | zero_shot | jest | jest | unknown | 14 | 2 |
| gemma_4 | zero_shot | repair | repair | repair_failed | 8 | 3 |
| gemma_4 | zero_shot | jest | jest | assertion_failure | 5 | 4 |
| gemma_4 | zero_shot | jest | jest | unexpected_throw | 2 | 5 |
| qwen_4b | few_shot | jest | jest | assertion_failure | 23 | 1 |
| qwen_4b | few_shot | jest | jest | runtime_error | 18 | 2 |
| qwen_4b | few_shot | jest | jest | unknown | 10 | 3 |
| qwen_4b | few_shot | repair | repair | repair_failed | 4 | 4 |
| qwen_4b | few_shot | pipeline | pipeline | rollback | 1 | 5 |
| qwen_4b | structured | jest | jest | assertion_failure | 36 | 1 |
| qwen_4b | structured | jest | jest | unknown | 15 | 2 |
| qwen_4b | structured | jest | jest | runtime_error | 14 | 3 |
| qwen_4b | structured | repair | repair | unparseable_failure | 8 | 4 |
| qwen_4b | structured | pipeline | pipeline | rollback | 3 | 5 |
| qwen_4b | zero_shot | jest | jest | runtime_error | 86 | 1 |
| qwen_4b | zero_shot | jest | jest | unexpected_throw | 10 | 2 |
| qwen_4b | zero_shot | jest | jest | unknown | 10 | 3 |
| qwen_4b | zero_shot | jest | jest | assertion_failure | 7 | 4 |
| qwen_4b | zero_shot | repair | repair | repair_failed | 6 | 5 |
| qwen_coder_3b | few_shot | jest | jest | runtime_error | 31 | 1 |
| qwen_coder_3b | few_shot | jest | jest | unknown | 9 | 2 |
| qwen_coder_3b | few_shot | jest | jest | assertion_failure | 7 | 3 |
| qwen_coder_3b | few_shot | jest | jest | unexpected_throw | 6 | 4 |
| qwen_coder_3b | few_shot | generation | generation | invalid_output | 2 | 5 |
| qwen_coder_3b | structured | jest | jest | unexpected_throw | 12 | 1 |
| qwen_coder_3b | structured | jest | jest | unknown | 12 | 2 |
| qwen_coder_3b | structured | jest | jest | assertion_failure | 11 | 3 |
| qwen_coder_3b | structured | jest | jest | runtime_error | 10 | 4 |
| qwen_coder_3b | structured | repair | repair | unparseable_failure | 8 | 5 |
| qwen_coder_3b | zero_shot | jest | jest | unknown | 37 | 1 |
| qwen_coder_3b | zero_shot | jest | jest | runtime_error | 28 | 2 |
| qwen_coder_3b | zero_shot | repair | repair | unparseable_failure | 20 | 3 |
| qwen_coder_3b | zero_shot | jest | jest | assertion_failure | 9 | 4 |
| qwen_coder_3b | zero_shot | jest | jest | unexpected_throw | 8 | 5 |
| qwen_coder_7b | few_shot | jest | jest | runtime_error | 16 | 1 |
| qwen_coder_7b | few_shot | jest | jest | assertion_failure | 8 | 2 |
| qwen_coder_7b | few_shot | jest | jest | unexpected_throw | 6 | 3 |
| qwen_coder_7b | few_shot | jest | jest | unknown | 2 | 4 |
| qwen_coder_7b | few_shot | repair | repair | repair_failed | 1 | 5 |
| qwen_coder_7b | structured | jest | jest | assertion_failure | 16 | 1 |
| qwen_coder_7b | structured | jest | jest | runtime_error | 16 | 2 |
| qwen_coder_7b | structured | jest | jest | unexpected_throw | 7 | 3 |
| qwen_coder_7b | structured | repair | repair | repair_failed | 4 | 4 |
| qwen_coder_7b | structured | jest | jest | unknown | 1 | 5 |
| qwen_coder_7b | zero_shot | jest | jest | runtime_error | 17 | 1 |
| qwen_coder_7b | zero_shot | jest | jest | assertion_failure | 15 | 2 |
| qwen_coder_7b | zero_shot | jest | jest | unknown | 9 | 3 |
| qwen_coder_7b | zero_shot | jest | jest | unexpected_throw | 6 | 4 |
| qwen_coder_7b | zero_shot | repair | repair | unparseable_failure | 4 | 5 |

## Repeated error signatures (same error_hash, >=2 occurrences)

| error_hash | model | strategy | phase | error_category | error_subcategory | occurrences | distinct_functions | sample_message |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2ca322236f16007840cf7e8abfbc15162da7933dc8752f1c6a0b9c76d3d03702 | falcon_7b | few_shot | repair | repair | unparseable_failure | 50 | 13 | 0 failures parsed from Jest output; whole-file repair is disabled for this attempt. |
| 2ca322236f16007840cf7e8abfbc15162da7933dc8752f1c6a0b9c76d3d03702 | falcon_7b | zero_shot | repair | repair | unparseable_failure | 21 | 6 | 0 failures parsed from Jest output; whole-file repair is disabled for this attempt. |
| 2ca322236f16007840cf7e8abfbc15162da7933dc8752f1c6a0b9c76d3d03702 | qwen_coder_3b | zero_shot | repair | repair | unparseable_failure | 20 | 5 | 0 failures parsed from Jest output; whole-file repair is disabled for this attempt. |
| 7c9b0000421fb2b8c0543bebd2506aa445d8236cffdddf477f92769ea1ab8f4e | qwen_4b | zero_shot | jest | jest | runtime_error | 16 | 1 | should throw BadRequestException when trying to change status of CORRECTED result: TypeError: service.updateResult is not a function |
| 07669857ffb0ce3ee50e620aaa2bdb3e306e87699a96b0b0862427652773b240 | falcon_7b | few_shot | repair | repair | max_repairs_exceeded | 13 | 13 | Runtime repair exhausted MAX_RUNTIME_REPAIRS=5 attempts |
| 0d16c8f359c6fc38433f5661628fbe6771226924b471bec9389d4732a5d95045 | gemma_4 | zero_shot | jest | jest | runtime_error | 12 | 1 | should throw BadRequestException if trying to change status of a CORRECTED result: TypeError: resultService.updateResult is not a function |
| 615ada9272a81140f9a5a423a82c2d6d1a70a6a70f42e8ab3051cab1f592dde0 | gemma_4 | zero_shot | jest | jest | runtime_error | 11 | 1 | should successfully transition the encounter status when the transition is valid: TypeError: service.transitionEncounterStatus is not a function |
| bf8b5eb7b2ef15faa711c67084a3c7832d89a2c22ef7977a0247ed58edd40b3e | qwen_4b | structured | jest | jest | assertion_failure | 11 | 1 | should build encounter summary with PENDING order status: Error: expect(received).toEqual(expected) // deep equality

- Expected  - 2
+ Received  + 2

@@ -1,7 +1,7 @@
  Object {
-   "activeDays": 365,
+   "activeDays": 974,
    "encounter": Object {
      "admitDate": 2024-01-01T00:00:00.000Z,
      "id": "1",
      "orders": Array [
        Object {
@@ -27,7 +27,7 @@
    "results": Object {
      "abnormal": 0,
      "preliminary": 0,
      "total": 0,
    },
-   "riskFlag": "LOW",
+   "riskFla |
| 05c37b85b94ced1f15bd08fc2b9d3f1ebb630a39098015d53df4e67f497b5ed9 | qwen_coder_3b | few_shot | jest | jest | runtime_error | 11 | 1 | should throw BadRequestException when order has final result and incoming status is CORRECTED: Error: expect(received).rejects.toThrow(expected)

Expected constructor: BadRequestException
Received constructor: TypeError

Received message: "Cannot read properties of undefined (reading 'status')"

    [0m [90m 94 |[39m     )[33m;[39m
     [90m 95 |[39m
    [31m[1m>[22m[39m[90m 96 |[39m     [36mif[39m (encounter[33m.[39mstatus [33m===[39m [33mEncounterStatus[39m[33m.[39m[33m |
| 8c78394828a91d3cc8c41d7286726a7c3beecfa43a2f2e635ebf8f34eec9e25b | falcon_7b | structured | jest | jest | runtime_error | 10 | 1 | should throw BadRequestException for invalid status transition: TypeError: Cannot read properties of undefined (reading 'mockResolvedValue') |
| ad77a286d9b730659c0b694c3f2cc73cc4ad3ffdb2584311e9914da651307192 | qwen_coder_3b | zero_shot | jest | jest | runtime_error | 10 | 1 | should throw BadRequestException for A01 with missing fields: TypeError: expect(...).rejects.toThrowError is not a function |
| a2179c9c972edf99b0537f8dbfbd43dee21a91f2d171aa75432f1942e2e59f77 | qwen_4b | zero_shot | jest | jest | runtime_error | 10 | 1 | should throw BadRequestException for invalid status transition from ADMITTED to DISCHARGED when not in valid transitions list: TypeError: service.transitionEncounterStatus is not a function |
| d35fe0cf64cb747d85949eeb4b4add6d7f682a4a9721d252399d6fd0f5b81f3d | qwen_coder_7b | structured | jest | jest | runtime_error | 10 | 1 | should return order if incoming status is corrected: TypeError: Cannot read properties of undefined (reading 'status') |
| 4cc1f6ebb8a5a6cdb1dc795862d6ce0d741da1826705046889d466916584decb | qwen_4b | zero_shot | jest | jest | runtime_error | 9 | 1 | should return LOW risk flag when no abnormal results and activeDays <= 7: TypeError: service.buildEncounterSummary is not a function |
| b3325981cbafb30183f159340bcdaeb28c51917932d441c93aa43f7b9bee34f1 | qwen_coder_3b | zero_shot | jest | jest | runtime_error | 9 | 1 | should throw BadRequestException if invalid status transition: TypeError: expect(...).rejects.toThrowError is not a function |
| a19dd2f169fea0f558514ac3dac1b23af029a1260819d762429f620cb291dccb | falcon_7b | structured | repair | repair | repair_failed | 9 | 8 | 1 repair attempt(s) did not produce a valid fix |
| f3cfa8d560a56d17459e9a56492f95e50f57a6fe109eb2aeb9b00cdd71d423aa | falcon_7b | zero_shot | jest | jest | runtime_error | 9 | 1 | should throw BadRequestException for invalid status transition: TypeError: Cannot read properties of undefined (reading 'mockResolvedValue') |
| af96f0b36851e307ff3bc45ae0f3100244b0c04a2a7d89a1b5fbb6a874b35afa | qwen_4b | zero_shot | jest | jest | runtime_error | 9 | 1 | should throw BadRequestException for A01 without ward: Error: expect(received).toThrow(expected)

Expected substring: "Ward is required for ADT A01 (admission)"
Received message:   "validateEncounterFields is not defined"

    [0m [90m 220 |[39m     } [36mas[39m [33mCreateEncounterDto[39m[33m;[39m
     [90m 221 |[39m
    [31m[1m>[22m[39m[90m 222 |[39m     expect(() [33m=>[39m validateEncounterFields(dto))[33m.[39mtoThrow([32m'Ward is required for ADT A01 (admission)'[39m) |
| f864f920aed0742dac82fd4fcd9a155247da0b24783d9d750e0c9db2ddb9da69 | qwen_coder_3b | zero_shot | jest | jest | unknown | 8 | 1 | should throw BadRequestException if status is CORRECTED and dto.status is provided: Error: Nest can't resolve dependencies of the ResultService (ResultRepository, ?). Please make sure that the argument OrderService at index [1] is available in the RootTestModule module.

Potential solutions:
- Is RootTestModule a valid NestJS module?
- If OrderService is a provider, is it part of the current RootTestModule?
- If OrderService is exported from a separate @Module, is that module imported within Roo |
| f0a7bd1c1c9fec9713495654702d41f5ce678f25ce86f05af76ee197b223765a | qwen_coder_3b | structured | jest | jest | runtime_error | 8 | 1 | should return order when incomingStatus is ResultStatus.CORRECTED: TypeError: Cannot read properties of undefined (reading 'status') |
| fc0c8e11ac7c4dd8ee7965bb6cdb81c9dfabac65b5696bd0e913a6bf932b3111 | qwen_4b | few_shot | jest | jest | runtime_error | 8 | 1 | should throw BadRequestException when encounter is discharged: TypeError: Cannot read properties of undefined (reading 'mockResolvedValueOnce') |
| 4c30d1dbe5f61220bb3c2f17cc96ea29ef6132575fcfbc915419232cf42827e5 | qwen_4b | zero_shot | jest | jest | runtime_error | 8 | 1 | should return LOW risk flag when no abnormal results and activeDays <= 7: TypeError: service.buildEncounterSummary is not a function |
| 2ca322236f16007840cf7e8abfbc15162da7933dc8752f1c6a0b9c76d3d03702 | qwen_4b | structured | repair | repair | unparseable_failure | 8 | 2 | 0 failures parsed from Jest output; whole-file repair is disabled for this attempt. |
| 14404a04a01b5f6ffaaa8907b5ad056fb6cc86001e012f208f0779e046e9416f | qwen_coder_7b | zero_shot | jest | jest | runtime_error | 8 | 1 | should throw BadRequestException if incoming status is CORRECTED and order is not completed: Error: expect(received).rejects.toThrow(expected)

Expected constructor: BadRequestException
Received constructor: TypeError

Received message: "Cannot read properties of undefined (reading 'status')"

    [0m [90m 94 |[39m     )[33m;[39m
     [90m 95 |[39m
    [31m[1m>[22m[39m[90m 96 |[39m     [36mif[39m (encounter[33m.[39mstatus [33m===[39m [33mEncounterStatus[39m[33m.[39m[33mDI |
| 1525108a51973fc28669c92fc81cbf66e59463b3dfbf9c0fe77bb78268301505 | qwen_coder_7b | few_shot | jest | jest | runtime_error | 8 | 1 | should throw BadRequestException when incoming status is CORRECTED and order is not completed: Error: expect(received).rejects.toThrow(expected)

Expected constructor: BadRequestException
Received constructor: TypeError

Received message: "Cannot read properties of undefined (reading 'status')"

    [0m [90m 94 |[39m     )[33m;[39m
     [90m 95 |[39m
    [31m[1m>[22m[39m[90m 96 |[39m     [36mif[39m (encounter[33m.[39mstatus [33m===[39m [33mEncounterStatus[39m[33m.[39m[33m |
| 2ca322236f16007840cf7e8abfbc15162da7933dc8752f1c6a0b9c76d3d03702 | qwen_coder_3b | structured | repair | repair | unparseable_failure | 8 | 2 | 0 failures parsed from Jest output; whole-file repair is disabled for this attempt. |
| 2f94207ccff0f814975b6522a696c58bb87e3d60fdfcad3386ad1d1088edb7e0 | gemma_4 | zero_shot | jest | jest | unknown | 7 | 1 | should throw BadRequestException if the encounter is discharged: Error: Nest can't resolve dependencies of the EncounterService (EncounterRepository, ?). Please make sure that the argument PatientService at index [1] is available in the RootTestModule module.

Potential solutions:
- Is RootTestModule a valid NestJS module?
- If PatientService is a provider, is it part of the current RootTestModule?
- If PatientService is exported from a separate @Module, is that module imported within RootTestMo |
| e607603bf63fe854c7800d07585d92a75ecd80d670c010833f0db13fb2188de8 | falcon_7b | structured | jest | jest | assertion_failure | 7 | 1 | should throw BadRequestException for discharge with pending orders: Error: expect(received).rejects.toThrow(expected)

Expected constructor: BadRequestException
Received constructor: NotFoundException

Received message: "Encounter with id mockEncounterId not found"

    [0m [90m 102 |[39m     [36mconst[39m encounter [33m=[39m [36mawait[39m [36mthis[39m[33m.[39mencounterRepository[33m.[39mfindById(id)[33m;[39m
     [90m 103 |[39m     [36mif[39m ([33m![39mencounter) {
    [ |
| a2a9986fc185c906d10d04eae588c3ea6642e8d3cf52e768e2f215cfd5c98e9c | qwen_coder_7b | zero_shot | jest | jest | runtime_error | 7 | 1 | should update patient with new email if email is different and not already registered: TypeError: Cannot read properties of undefined (reading 'mockResolvedValue') |
| e418635f9ee48c63962dbb77c531dda539556093a97dbef8055683cb69f1fd67 | qwen_4b | structured | jest | jest | assertion_failure | 7 | 1 | should build encounter summary with PENDING order status: Error: expect(received).toEqual(expected) // deep equality

- Expected  - 2
+ Received  + 2

@@ -1,7 +1,7 @@
  Object {
-   "activeDays": 365,
+   "activeDays": 974,
    "encounter": Object {
      "admitDate": 2024-01-01T00:00:00.000Z,
      "id": "1",
      "orders": Array [
        Object {
@@ -27,7 +27,7 @@
    "results": Object {
      "abnormal": 0,
      "preliminary": 0,
      "total": 0,
    },
-   "riskFlag": "LOW",
+   "riskFla |
| f2fd256eb596d10e0130c7eed0e71a41725b285c3697f15a3bc178473b2f1539 | gemma_4 | zero_shot | jest | jest | runtime_error | 7 | 1 | should throw BadRequestException if trying to register a CORRECTED result when order is not COMPLETED: Error: expect(received).rejects.toThrow(expected)

Expected constructor: BadRequestException
Received constructor: TypeError

Received message: "Cannot read properties of undefined (reading 'status')"

    [0m [90m 94 |[39m     )[33m;[39m
     [90m 95 |[39m
    [31m[1m>[22m[39m[90m 96 |[39m     [36mif[39m (encounter[33m.[39mstatus [33m===[39m [33mEncounterStatus[39m[33m.[ |
| 2707ea3e319fafc140dcf1063e9e752c043d3cb721ebad365e9f47fc163a880a | falcon_7b | structured | jest | jest | runtime_error | 6 | 1 | should handle preliminary result: TypeError: Cannot read properties of undefined (reading 'examType') |
| 17aa101a1a6a388daed4232bf873d7a620f9d5cd78bea5afcd7d177ebaa95950 | qwen_coder_3b | few_shot | jest | jest | runtime_error | 6 | 1 | should throw BadRequestException when A01 requires missing fields: Error: expect(received).rejects.toThrow(expected)

Expected constructor: BadRequestException
Received constructor: TypeError

Received message: "Cannot read properties of undefined (reading 'id')"

    [0m [90m 226 |[39m
     [90m 227 |[39m       [36mconst[39m encounter [33m=[39m [36mawait[39m [36mthis[39m[33m.[39mcreateEncounter({
    [31m[1m>[22m[39m[90m 228 |[39m         patientId[33m:[39m patient[33m. |
| 07669857ffb0ce3ee50e620aaa2bdb3e306e87699a96b0b0862427652773b240 | falcon_7b | zero_shot | repair | repair | max_repairs_exceeded | 6 | 6 | Runtime repair exhausted MAX_RUNTIME_REPAIRS=5 attempts |
| c681d689512dece969109469542d2b644731a8cadeb44192ae15ddf11d40c818 | falcon_7b | zero_shot | jest | jest | assertion_failure | 6 | 1 | should buildEncounterSummary with valid inputs: Error: expect(received).toEqual(expected) // deep equality

- Expected  - 4
+ Received  + 4

@@ -1,7 +1,7 @@
  Object {
-   "activeDays": 1,
+   "activeDays": 1339,
    "encounter": Object {
      "admitDate": 2023-01-01T00:00:00.000Z,
      "id": "123",
      "orders": Array [
        Object {
@@ -16,11 +16,11 @@
          "status": "PENDING",
        },
      ],
      "patientId": "patientId",
    },
-   "hasAbnormalResults": true,
+   "hasAbnorm |
| d4bbb8e59f06f812c772219f773d3da10c07cc56ce973e07b297394c1c806de5 | qwen_4b | structured | jest | jest | assertion_failure | 6 | 1 | should build encounter summary with PENDING order status: Error: expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 1

@@ -1,7 +1,7 @@
  Object {
-   "activeDays": 365,
+   "activeDays": 974,
    "encounter": Object {
      "admitDate": 2024-01-01T00:00:00.000Z,
      "id": "1",
      "orders": Array [
        Object { |
| 821dcc648589441fd2a1f45350e7aba8eb8331e2e7b560fc2457eb6dbe9da236 | gemma_4 | zero_shot | jest | jest | runtime_error | 6 | 1 | should throw BadRequestException if the order status is CANCELLED: TypeError: service.updateOrder is not a function |
| b9fd1c089e4aaa50d373399bde54e3eecf1481d01b7b9a4d8e187b7edd88b6ea | qwen_coder_3b | few_shot | jest | jest | unknown | 6 | 1 | should throw BadRequestException when ADT Type is A01 and Wart is not provided: BadRequestException: Ward is required for ADT A01 (admission) |
| 970cf79bbd6cba6560bef7d30cdd159335961c36ca4972407c32201c4620c8ff | falcon_7b | zero_shot | jest | jest | runtime_error | 5 | 1 | should throw BadRequestException for completed order: Error: expect(received).rejects.toThrow(expected)

Expected constructor: BadRequestException
Received constructor: TypeError

Received message: "Cannot read properties of undefined (reading 'status')"

    [0m [90m 94 |[39m     )[33m;[39m
     [90m 95 |[39m
    [31m[1m>[22m[39m[90m 96 |[39m     [36mif[39m (encounter[33m.[39mstatus [33m===[39m [33mEncounterStatus[39m[33m.[39m[33mDISCHARGED[39m) {
     [90m    |[39m   |
| 971753e8513adfce4ead57482ad2aaeae368dc75905f5fe6430f74b2981733c9 | qwen_coder_7b | structured | jest | jest | assertion_failure | 5 | 1 | should return encounter summary with correct values: Error: expect(received).toBe(expected) // Object.is equality

Expected: 2
Received: 1249 |
| 730a1178036e412983ef89b32a0ccbd7525d93c9717f1ae2ef48d656bcb6e5f9 | qwen_coder_7b | zero_shot | jest | jest | assertion_failure | 5 | 1 | should build encounter summary with no abnormal results and active days less than 7: Error: expect(received).toEqual(expected) // deep equality

- Expected  - 2
+ Received  + 2

@@ -1,7 +1,7 @@
  Object {
-   "activeDays": 10,
+   "activeDays": 1249,
    "encounter": Object {
      "admitDate": "2023-04-01T00:00:00Z",
      "id": "123",
      "orders": Array [
        Object {
@@ -37,7 +37,7 @@
    "results": Object {
      "abnormal": 0,
      "preliminary": 0,
      "total": 1,
    },
-   "ris |
| 74a725c66975b3ea86ed1108140044bae0e9e0f679ec4a4ab42a2f27804140f1 | gemma_4 | structured | jest | jest | unknown | 5 | 1 | should throw BadRequestException when adtType is A01 and ward is missing: BadRequestException: Ward is required for ADT A01 (admission) |
| 43a26294b3d5a77a80802cd25d84488f39c6da3098bc822960370e1abcc36098 | qwen_4b | structured | jest | jest | unknown | 5 | 1 | C:\Users\cdbaz\OneDrive\Documentos\Projetos\usp\tcc\health-microservice-corpus\corpus\src\order\order.service.ts:3262
      throw new common_1.BadRequestException('Cannot update requestedBy for an order in progress. Only notes can be updated');
            ^

[BadRequestException: Cannot update requestedBy for an order in progress. Only notes can be updated] {
  response: {
    message: 'Cannot update requestedBy for an order in progress. Only notes can be updated',
    error: 'Bad Request', |
| 4a3befe1e8dc9bc140804ca1ee34f140c39979b86a81d8a1dd3d95e9ca45ad02 | qwen_coder_3b | structured | jest | jest | unknown | 5 | 1 | C:\Users\cdbaz\OneDrive\Documentos\Projetos\usp\tcc\health-microservice-corpus\corpus\src\result\result.service.spec.ts:102
                orderServiceMock.validateOrderResult.mockRejectedValue(new Error('Invalid order result'));
                                                                       ^

[Error: Invalid order result]

Node.js v18.16.0 |
| 74b34ff7f3285fad1bcbe32400b2b6f77cf5c67a287bb061ad95cdb8ed427d4c | qwen_coder_3b | zero_shot | jest | jest | unknown | 5 | 1 | C:\Users\cdbaz\OneDrive\Documentos\Projetos\usp\tcc\health-microservice-corpus\corpus\src\order\order.service.ts:2984
      throw new common_1.BadRequestException('Cannot create order for a discharged encounter');
            ^

[BadRequestException: Cannot create order for a discharged encounter] {
  response: {
    message: 'Cannot create order for a discharged encounter',
    error: 'Bad Request',
    statusCode: 400
  },
  status: 400,
  options: {}
}

Node.js v18.16.0 |
| 80cdc603e7f2b71cc0bf35fda84a0b8ed1e6ff5315974add576ea91662d35aad | falcon_7b | zero_shot | jest | jest | unexpected_throw | 5 | 1 | C:\Users\cdbaz\OneDrive\Documentos\Projetos\usp\tcc\health-microservice-corpus\corpus\node_modules\expect\build\index.js:2116
  const err = new JestAssertionError();
              ^

[JestAssertionError: expect(received).rejects.toThrow()

Received promise resolved instead of rejected
Resolved to value: undefined] {
  matcherResult: undefined
}

Node.js v18.16.0 |
| 29d4d4368b3d1dccb0a13b36ea4794dadac384c5d8b54f109cd1cb0a6a474b61 | qwen_coder_3b | zero_shot | jest | jest | unknown | 5 | 1 | C:\Users\cdbaz\OneDrive\Documentos\Projetos\usp\tcc\health-microservice-corpus\corpus\src\result\result.service.ts:3539
      throw new common_1.NotFoundException(`No results found for order ${orderId}`);
            ^

[NotFoundException: No results found for order 123] {
  response: {
    message: 'No results found for order 123',
    error: 'Not Found',
    statusCode: 404
  },
  status: 404,
  options: {}
}

Node.js v18.16.0 |
| 3ecd8fd5ca572278af5b523fcbd9194886e70ab1adc370c43fbd4cd96894d649 | qwen_coder_3b | zero_shot | jest | jest | unknown | 5 | 1 | C:\Users\cdbaz\OneDrive\Documentos\Projetos\usp\tcc\health-microservice-corpus\corpus\src\encounter\encounter.service.ts:6126
      throw new common_1.BadRequestException('Cannot update a discharged encounter');
            ^

[BadRequestException: Cannot update a discharged encounter] {
  response: {
    message: 'Cannot update a discharged encounter',
    error: 'Bad Request',
    statusCode: 400
  },
  status: 400,
  options: {}
}

Node.js v18.16.0 |
| 1e30978273efde0a273542927594d22cd501664b19f761740f9126f85e99eb7e | gemma_4 | few_shot | jest | jest | unknown | 5 | 1 | should throw BadRequestException when adtType is A01 and ward is missing: BadRequestException: Ward is required for ADT A01 (admission) |
| 37b068e80db3e0558f2c0cc031a5ec3d66f131014e0ff3b525d25bded61daa10 | falcon_7b | structured | jest | jest | runtime_error | 5 | 1 | should return order when incomingStatus is CORRECTED and order is completed: TypeError: Cannot read properties of undefined (reading 'status') |
| 3dc1be9a54850e3d115b9d957507e395ae1bcd1e7e7a373732a7420736fc2bfa | qwen_coder_3b | structured | jest | jest | unknown | 5 | 1 | should throw BadRequestException for ADT A01 with no Wart: BadRequestException: Ward is required for ADT A01 (admission) |
| 0d4b6d1596fb29689aa858a94bf362576501f06773c7791a3f725d0ed2c0dd1c | qwen_coder_3b | zero_shot | jest | jest | unknown | 5 | 1 | C:\Users\cdbaz\OneDrive\Documentos\Projetos\usp\tcc\health-microservice-corpus\corpus\src\order\order.service.ts:2963
      throw new common_1.NotFoundException(`Order with id ${id} not found`);
            ^

[NotFoundException: Order with id 123 not found] {
  response: {
    message: 'Order with id 123 not found',
    error: 'Not Found',
    statusCode: 404
  },
  status: 404,
  options: {}
}

Node.js v18.16.0 |
| 07669857ffb0ce3ee50e620aaa2bdb3e306e87699a96b0b0862427652773b240 | qwen_coder_3b | zero_shot | repair | repair | max_repairs_exceeded | 5 | 5 | Runtime repair exhausted MAX_RUNTIME_REPAIRS=5 attempts |
| 0804b46b614219e8228c6aa5785c749926aee6c272a804588d02eb019aeb38bc | qwen_4b | zero_shot | jest | jest | runtime_error | 5 | 1 | should return LOW risk flag when no abnormal results and activeDays <= 7: TypeError: service.buildEncounterSummary is not a function |
| ac3d9725582e4ca9ca05cbc90fe467c0eb13e64f445a56777295865b59ab3715 | falcon_7b | structured | jest | jest | unknown | 5 | 1 | should throw BadRequestException for ADT A01 without ward: BadRequestException: Ward is required for ADT A01 (admission) |
| d3b2cb576562bcff44538df155ffed96641fbb7edae0500d5506bd37a1a9b640 | falcon_7b | few_shot | jest | jest | unknown | 5 | 1 | should throw BadRequestException when ADT A01 and ward is not provided: BadRequestException: Ward is required for ADT A01 (admission) |
| 88ba5dbfb24b991639ad11acbba4f51e348f6bab448783e5fa1b382a6221ca2c | qwen_coder_7b | zero_shot | jest | jest | unknown | 5 | 1 | C:\Users\cdbaz\OneDrive\Documentos\Projetos\usp\tcc\health-microservice-corpus\corpus\src\order\order.service.spec.ts:252
                orderRepositoryMock.search.mockRejectedValue(new Error('Repository error'));
                                                             ^

[Error: Repository error]

Node.js v18.16.0 |
| a0c83af1e73a2b98baf65362e8889e6e68dcedf4013b31bd95d668fd02f85e6a | gemma_4 | few_shot | jest | jest | unknown | 5 | 1 | should throw BadRequestException when adtType is A01 and ward is missing: BadRequestException: Ward is required for ADT A01 (admission) |
| b39c1af044098cfecfa85a9eca8f6367ede90385a9101e146722f5f848125fa4 | qwen_4b | structured | jest | jest | unknown | 5 | 1 | C:\Users\cdbaz\OneDrive\Documentos\Projetos\usp\tcc\health-microservice-corpus\corpus\src\encounter\encounter.service.ts:5499
      throw new common_1.BadRequestException('Only ADT A01 can create an encounter; use the ADT workflow for A02, A03 and A08');
            ^

[BadRequestException: Only ADT A01 can create an encounter; use the ADT workflow for A02, A03 and A08] {
  response: {
    message: 'Only ADT A01 can create an encounter; use the ADT workflow for A02, A03 and A08',
    error: 'Bad |
| cda58fcc7e1e395aabc28c6cb1491db76d8dc12f561f27e7e1f7247757a3ece1 | qwen_coder_3b | few_shot | jest | jest | runtime_error | 5 | 1 | should throw BadRequestException when order is pending and incoming status is PRELIMINARY: Error: expect(received).rejects.toThrow(expected)

Expected constructor: BadRequestException
Received constructor: TypeError

Received message: "Cannot read properties of undefined (reading 'status')"

    [0m [90m 94 |[39m     )[33m;[39m
     [90m 95 |[39m
    [31m[1m>[22m[39m[90m 96 |[39m     [36mif[39m (encounter[33m.[39mstatus [33m===[39m [33mEncounterStatus[39m[33m.[39m[33mDISC |
| 63ee39d5d2033407a83a4ebc5b971eee30febbd7042bfb2434d4ba8b55027427 | gemma_4 | structured | jest | jest | unknown | 5 | 1 | should throw BadRequestException when adtType is A01 and ward is missing: BadRequestException: Ward is required for ADT A01 (admission) |
| 462a14279a63f4c5b362c6d2acdc54cca6b6798a365850843c6f6135eb36e8e0 | qwen_coder_3b | zero_shot | jest | jest | unknown | 5 | 1 | C:\Users\cdbaz\OneDrive\Documentos\Projetos\usp\tcc\health-microservice-corpus\corpus\src\result\result.service.ts:3515
      throw new common_1.NotFoundException(`Result with id ${id} not found`);
            ^

[NotFoundException: Result with id 123 not found] {
  response: {
    message: 'Result with id 123 not found',
    error: 'Not Found',
    statusCode: 404
  },
  status: 404,
  options: {}
}

Node.js v18.16.0 |
| a2461a623a892c6825d5ad0c90e9dd8c02a69484cbe7d68acc0cc4a203c0458a | gemma_4 | zero_shot | jest | jest | runtime_error | 5 | 1 | should update patient details successfully without email change: TypeError: Cannot read properties of undefined (reading 'mock') |
| a19dd2f169fea0f558514ac3dac1b23af029a1260819d762429f620cb291dccb | qwen_4b | zero_shot | repair | repair | repair_failed | 5 | 4 | 1 repair attempt(s) did not produce a valid fix |
| 0fd29f88c5be4939b775dbc686c712cb944605dcb8bee66e3978f636fa63783d | qwen_4b | structured | jest | jest | assertion_failure | 4 | 1 | should handle A01 with valid data - returns patient and encounter: Error: expect(received).resolves.toEqual()

Received promise rejected instead of resolved
Rejected to value: [BadRequestException: Ward is required for ADT A01 (admission)] |
| 075b931f5a90d0c974d1a1dd694a1e4be49d524be6a92c48ea97c9253fa7f063 | falcon_7b | zero_shot | jest | jest | runtime_error | 4 | 1 | should handle A01 message: TypeError: Cannot read properties of undefined (reading 'id') |
| 2a717bb3087bc19ff32aba731b68b0139a985b4271c976f67b64bb6db708cc5a | qwen_4b | zero_shot | jest | jest | runtime_error | 4 | 1 | should return LOW risk flag when no abnormal results and activeDays <= 7: TypeError: service.buildEncounterSummary is not a function |
| 2ca322236f16007840cf7e8abfbc15162da7933dc8752f1c6a0b9c76d3d03702 | qwen_coder_7b | zero_shot | repair | repair | unparseable_failure | 4 | 1 | 0 failures parsed from Jest output; whole-file repair is disabled for this attempt. |
| a19dd2f169fea0f558514ac3dac1b23af029a1260819d762429f620cb291dccb | gemma_4 | zero_shot | repair | repair | repair_failed | 4 | 4 | 1 repair attempt(s) did not produce a valid fix |
| d162f36e94a2fb7571633fcc0a4674dc85a5f2d07bc938977705a08ee1191682 | gemma_4 | few_shot | jest | jest | assertion_failure | 4 | 1 | should create a new patient and an encounter for A01: BadRequestException: Ward is required for ADT A01 (admission) |
| a19dd2f169fea0f558514ac3dac1b23af029a1260819d762429f620cb291dccb | qwen_coder_7b | structured | repair | repair | repair_failed | 4 | 2 | 1 repair attempt(s) did not produce a valid fix |
| c70f9e94faaefb8f4ec50c644e3aad3205b1c7179c623eedd26d85b0dab92e7e | qwen_4b | few_shot | jest | jest | assertion_failure | 4 | 1 | should return EncounterSummary with MEDIUM risk flag when has abnormal results and active days <= 7: Error: expect(received).toBe(expected) // Object.is equality

Expected: "MEDIUM"
Received: "LOW" |
| b599dc458d20e0ecd546f4c55dd17f960c0b789c8d00b9d4dbf28732d03dce86 | qwen_coder_3b | zero_shot | jest | jest | runtime_error | 4 | 1 | should throw BadRequestException for invalid ADT type: TypeError: expect(...).rejects.toThrowError is not a function |
| b3be52a02cefa615a42c8227ad19f0dcfb30e8b272f60ddd94efd6dbd371855d | qwen_coder_3b | structured | jest | jest | assertion_failure | 4 | 1 | should find an existing patient and create an encounter for A01 adtType: BadRequestException: Ward is required for ADT A01 (admission) |
| 436cc957e9a778b29a97ca956123132e1c0df173ee7cf748f0cca9bf7687cdcc | qwen_4b | zero_shot | jest | jest | unknown | 4 | 1 | should throw BadRequestException for invalid status transition from ADMITTED to DISCHARGED when not in valid transitions list: Error: expect(received).rejects.toThrow()

Matcher error: received value must be a promise or a function returning a promise

Received has value: undefined |
| 6b1c9fe1fab2736ec01471d35d92fae2a3acc52e9aefbea4a31d6cf647efcdd5 | falcon_7b | structured | jest | jest | runtime_error | 4 | 1 | should throw BadRequestException for cancelled or completed orders: Error: expect(received).rejects.toThrow(expected)

Expected constructor: BadRequestException
Received constructor: TypeError

Received message: "this.orderRepository.findById is not a function"

    [0m [90m 25 |[39m
     [90m 26 |[39m   [36masync[39m getOrderById(id[33m:[39m string)[33m:[39m [33mPromise[39m[33m<[39m[33mOrder[39m[33m>[39m {
    [31m[1m>[22m[39m[90m 27 |[39m     [36mconst[39m order [33 |
| 6a594ae7184cb9fdd89839a48f7539d7a991d7c07f9a687952d491e2ea75117a | gemma_4 | structured | jest | jest | runtime_error | 4 | 1 | should handle AdtType A01 successfully by creating an encounter: ReferenceError: createEncounter is not defined |
| 883f38cb3fd8e57b97fbf61727677ed9456b5903f17d2891a7895200fcda1917 | falcon_7b | structured | jest | jest | assertion_failure | 4 | 1 | should throw BadRequestException for transfer without transferDate: Error: expect(received).rejects.toThrow(expected)

Expected constructor: BadRequestException
Received constructor: NotFoundException

Received message: "Encounter with id undefined not found"

    [0m [90m 102 |[39m     [36mconst[39m encounter [33m=[39m [36mawait[39m [36mthis[39m[33m.[39mencounterRepository[33m.[39mfindById(id)[33m;[39m
     [90m 103 |[39m     [36mif[39m ([33m![39mencounter) {
    [31m[1 |
| 7de1ef0ee435cafa79605a01af83e7186eceaa135d7d48abbdd11f5809d1b439 | qwen_4b | zero_shot | jest | jest | runtime_error | 4 | 1 | should create patient successfully with valid data: TypeError: Cannot read properties of undefined (reading 'replace') |
| 968a3688b5d446d7eba261d736363dbae313c69c9b6fded9182ae5cdf3ccfc9f | qwen_4b | zero_shot | jest | jest | runtime_error | 4 | 1 | should return LOW risk flag when no abnormal results and activeDays <= 7: TypeError: service.buildEncounterSummary is not a function |
| 8b982f99b9adc524e1c4e2a9731131c86ed65f6d18fe823eb8889f68182eead5 | falcon_7b | structured | jest | jest | runtime_error | 4 | 1 | should throw BadRequestException for cancelled or completed orders: Error: expect(received).rejects.toThrow(expected)

Expected constructor: BadRequestException
Received constructor: TypeError

Received message: "this.orderRepository.findById is not a function"

    [0m [90m 25 |[39m
     [90m 26 |[39m   [36masync[39m getOrderById(id[33m:[39m string)[33m:[39m [33mPromise[39m[33m<[39m[33mOrder[39m[33m>[39m {
    [31m[1m>[22m[39m[90m 27 |[39m     [36mconst[39m order [33 |
| 92a0314fa8c5bf332b32231faa0dd423d8c63e38f1d5905576eabcb26ccdf149 | qwen_4b | structured | jest | jest | assertion_failure | 4 | 1 | should build encounter summary with COMPLETED order status: Error: expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 1

@@ -1,7 +1,7 @@
  Object {
-   "activeDays": 365,
+   "activeDays": 0,
    "encounter": Object {
      "admitDate": "2024-01-01",
      "id": "1",
      "orders": Array [
        Object { |
| 2b4174000bb2ce09b371befe017029260089b679a199f81a21ab39398057e434 | falcon_7b | structured | repair | repair | repair_failed | 3 | 3 | 2 repair attempt(s) did not produce a valid fix |
| 2b4174000bb2ce09b371befe017029260089b679a199f81a21ab39398057e434 | gemma_4 | zero_shot | repair | repair | repair_failed | 3 | 3 | 2 repair attempt(s) did not produce a valid fix |
| 0f391c0d58af33a206357df1fa3bd6f956de49fac495da3ab0edbbe4ca9accc4 | qwen_coder_3b | zero_shot | jest | jest | assertion_failure | 3 | 1 | should build an encounter summary with no abnormal results and no risk flag: NotFoundException: Encounter with id 1 not found |
| 2b4174000bb2ce09b371befe017029260089b679a199f81a21ab39398057e434 | qwen_4b | few_shot | repair | repair | repair_failed | 3 | 1 | 2 repair attempt(s) did not produce a valid fix |
| 35251bbda9ab2352e166c2d16974ff3c4523715bcc78f7566849149be713fe56 | qwen_coder_3b | few_shot | jest | jest | runtime_error | 3 | 1 | should throw BadRequestException when patient is not found: Error: expect(received).rejects.toThrow(expected)

Expected constructor: BadRequestException
Received constructor: TypeError

Received message: "Cannot read properties of null (reading 'id')"

    [0m [90m 226 |[39m
     [90m 227 |[39m       [36mconst[39m encounter [33m=[39m [36mawait[39m [36mthis[39m[33m.[39mcreateEncounter({
    [31m[1m>[22m[39m[90m 228 |[39m         patientId[33m:[39m patient[33m.[39mid[33m, |
| 339429c06a1ea66a3cfffcd7236b5ff9d7d76959bf723f53c426c855f7b010b8 | qwen_4b | structured | jest | jest | runtime_error | 3 | 1 | should handle A01 with valid data - returns patient and encounter: Error: expect(received).resolves.toEqual()

Received promise rejected instead of resolved
Rejected to value: [TypeError: Cannot read properties of undefined (reading 'active')] |
| 3a491cbfb8f8044b352908dc794ced329a395ccf5edb714c5f28e37d126dd54d | qwen_coder_7b | few_shot | jest | jest | runtime_error | 3 | 1 | should throw BadRequestException when incoming status is CORRECTED and order does not have exactly one final result: Error: expect(received).rejects.toThrow(expected)

Expected constructor: BadRequestException
Received constructor: TypeError

Received message: "Cannot read properties of undefined (reading 'status')"

    [0m [90m 94 |[39m     )[33m;[39m
     [90m 95 |[39m
    [31m[1m>[22m[39m[90m 96 |[39m     [36mif[39m (encounter[33m.[39mstatus [33m===[39m [33mEncounterStatu |
| 3e1f1055c290934786aacd997591f0dc162ca824c401634c60046a31f11aab23 | qwen_coder_7b | structured | jest | jest | unexpected_throw | 3 | 1 | should throw BadRequestException when admitDate is provided but encounter is not admitted: Error: expect(received).rejects.toThrow()

Received promise resolved instead of rejected
Resolved to value: undefined |
| f398f5e846b6f7b5f516768bb0e52f951682761512f120455c3bca4e9e4f144c | gemma_4 | zero_shot | jest | jest | unknown | 3 | 1 | should handle ADT type A01 by creating a new patient and an encounter: BadRequestException: Ward is required for ADT A01 (admission) |
| ef7fa74637bfc48a04a41b9e5317691992f1b8f3f2e9c0310ce22040d7dabeb2 | gemma_4 | zero_shot | jest | jest | unknown | 3 | 1 | should throw BadRequestException if admitDate is a future date: Error: Nest can't resolve dependencies of the EncounterService (EncounterRepository, ?). Please make sure that the argument PatientService at index [1] is available in the RootTestModule module.

Potential solutions:
- Is RootTestModule a valid NestJS module?
- If PatientService is a provider, is it part of the current RootTestModule?
- If PatientService is exported from a separate @Module, is that module imported within RootTestMod |
| cf556ec3bcc9428d4ee4d51b7c6f61b714614080a87c3ed10902950ba593de34 | falcon_7b | structured | jest | jest | assertion_failure | 3 | 1 | should return EncounterSummary with correct values for an active encounter: Error: expect(received).toEqual(expected) // deep equality

- Expected  - 4
+ Received  + 4

@@ -1,7 +1,7 @@
  Object {
-   "activeDays": 10,
+   "activeDays": 1339,
    "encounter": Object {
      "admitDate": 2023-01-01T00:00:00.000Z,
      "orders": Array [
        Object {
          "results": Array [
@@ -14,11 +14,11 @@
          ],
          "status": "PENDING",
        },
      ],
    },
-   "hasAbnormalResults":  |
| e5d1357910ade9f4230c7dbf492e8a2dcacfeb3783f62d5be8d2686671f2155c | gemma_4 | structured | jest | jest | unknown | 3 | 1 | should correctly determine riskFlag as MEDIUM when abnormal results exist but activeDays <= 7: NotFoundException: Encounter with id id9 not found |
| d6131df504cdb5ff9f7b3bc54443971b44b88fc6dd994c4b427e0c45870934c6 | qwen_4b | zero_shot | jest | jest | unexpected_throw | 3 | 1 | should update admitDate when status is ADMITTED: NotFoundException: Encounter with id 123 not found |
| f374c5352c1807c736e845e23723c41e47c0e9fa3adbfab12499ea3ea84e4bc0 | qwen_4b | zero_shot | jest | jest | runtime_error | 3 | 1 | should update patient successfully when no email conflict exists: TypeError: service.getPatientById.mockResolvedValue is not a function |
| b008893f942b1c3a3ad61e7fde37129342eb253ff90dfce12a6c18a91bce2a49 | gemma_4 | structured | jest | jest | unknown | 3 | 1 | should correctly determine riskFlag as MEDIUM when abnormal results exist but activeDays <= 7: NotFoundException: Encounter with id id9 not found |
| a11b122882c52933f4b761b31199c4e6e1638d41a971d7e6da3fc3ae86f93a50 | gemma_4 | structured | jest | jest | unknown | 3 | 1 | should correctly determine riskFlag as MEDIUM when abnormal results exist but activeDays <= 7: NotFoundException: Encounter with id id9 not found |
| 84f90bb161c0d33133f0f2f0fc54f22f2f7e58af80b634a298f590602360e722 | falcon_7b | structured | jest | jest | runtime_error | 3 | 1 | should handle corrected result: TypeError: Cannot read properties of undefined (reading 'examType') |
| 7caff97ee5bb332e1c229e7f21bb11184357e65d33de5f4c43624deaa8d57136 | qwen_4b | structured | jest | jest | unknown | 3 | 1 | should update patient when email is not taken: NotFoundException: Patient with id 1 not found |
| 79eff9fcf7fb984fde992a30d6933360cb8c1b05961505fe5df5efbc9853b3df | gemma_4 | structured | jest | jest | assertion_failure | 3 | 1 | should calculate summary correctly when an encounter has pending orders and no abnormal results: Error: expect(received).toBe(expected) // Object.is equality

Expected: 1
Received: 0 |
| 82620d75c5199f76c6c9aa9b5944e34117ab9ee709748b5a7ca6f52e08be0643 | qwen_4b | structured | jest | jest | runtime_error | 3 | 1 | should throw ConflictException when email already registered: ReferenceError: getPatientByIdMock is not defined |
| 7db0323827a2bdcaddff2172143120f17ab310445b884f083287bb257f1229cb | falcon_7b | structured | jest | jest | runtime_error | 3 | 1 | should throw ConflictException when cpf already exists: Error: expect(received).rejects.toThrow(expected)

Expected constructor: ConflictException
Received constructor: TypeError

Received message: "Cannot read properties of undefined (reading 'replace')"

    [0m [90m 26 |[39m
     [90m 27 |[39m   [36masync[39m createPatient(dto[33m:[39m [33mCreatePatientDto[39m)[33m:[39m [33mPromise[39m[33m<[39m[33mPatient[39m[33m>[39m {
    [31m[1m>[22m[39m[90m 28 |[39m     [36mcon |
| 4ae588554e6fa0b9584f51970fafd7ce03f111d67883ee05381e4d8be0663867 | gemma_4 | structured | jest | jest | unknown | 3 | 1 | should correctly determine riskFlag as MEDIUM when abnormal results exist but activeDays <= 7: NotFoundException: Encounter with id id9 not found |
| 3ed3518eeee1e600a7eabbf913023dc57f3c219b47d704932e3d435e4ad5def3 | qwen_4b | few_shot | jest | jest | runtime_error | 3 | 1 | should update encounter status for A02: TypeError: Cannot read properties of undefined (reading 'mockResolvedValueOnce') |
| 4cbdce36c0ad681afa340db716dfbbbe922564f5ceebd5e6691b154942d36b05 | falcon_7b | structured | jest | jest | runtime_error | 3 | 1 | should throw BadRequestException for discharged encounter: Error: expect(received).rejects.toThrow(expected)

Expected constructor: BadRequestException
Received constructor: TypeError

Received message: "this.encounterService.getEncounterById is not a function"

    [0m [90m 33 |[39m
     [90m 34 |[39m   [36masync[39m createOrder(dto[33m:[39m [33mCreateOrderDto[39m)[33m:[39m [33mPromise[39m[33m<[39m[33mOrder[39m[33m>[39m {
    [31m[1m>[22m[39m[90m 35 |[39m     [36mcon |
| 9f690eb608aba831e37df377de13ee4d3082f9cecbb46b51375bee55f8e94115 | gemma_4 | zero_shot | jest | jest | runtime_error | 3 | 1 | should throw BadRequestException if the status transition is invalid: TypeError: service.transitionEncounterStatus is not a function |
| 97e060e54d0b6bc9e8b93948dd1bbb52577d6ea4cdc664a0dab1e4a821e11cee | qwen_coder_7b | few_shot | jest | jest | runtime_error | 3 | 1 | should create and return a new patient and encounter for A01: TypeError: Cannot read properties of undefined (reading 'active') |
| 79eff9fcf7fb984fde992a30d6933360cb8c1b05961505fe5df5efbc9853b3df | gemma_4 | structured | jest | jest | unknown | 3 | 1 | should correctly determine riskFlag as MEDIUM when abnormal results exist but activeDays <= 7: NotFoundException: Encounter with id id9 not found |
| 5c88c2de833be6de36c3cce0933926ed5b2257fa95c3fbf31fc86c72cdc81c65 | qwen_4b | structured | jest | jest | assertion_failure | 3 | 1 | should build encounter summary with HIGH risk flag when hasAbnormalResults and activeDays > 7: Error: expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 1

@@ -1,7 +1,7 @@
  Object {
-   "activeDays": 8,
+   "activeDays": 974,
    "encounter": Object {
      "admitDate": 2024-01-01T00:00:00.000Z,
      "id": "1",
      "orders": Array [
        Object { |
| 6f45b5ea34705ab2a769ee00fcbb927e9803e14d53202b7dddca4b3e6b8d1c92 | falcon_7b | structured | jest | jest | unknown | 3 | 1 | should handle A02 message transition: NotFoundException: Encounter with id encounterId not found |
| 047535d2e935e1accaad4b783b2d8b62cde79790772216298f3f6d739536b95e | falcon_7b | zero_shot | jest | jest | assertion_failure | 3 | 1 | should buildEncounterSummary with valid inputs: Error: expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 1

@@ -34,7 +34,7 @@
    "results": Object {
      "abnormal": 0,
      "preliminary": 1,
      "total": 1,
    },
-   "riskFlag": "LOW",
+   "riskFlag": "MEDIUM",
  } |
| 0197f8b878f9028ce210819790360bbaa05d6fc6b0b1667755a5b1d422224e9f | qwen_coder_7b | structured | jest | jest | assertion_failure | 3 | 1 | should return result report with correct summary and items when results are found: Error: expect(received).toEqual(expected) // deep equality

- Expected  - 4
+ Received  + 4

@@ -2,24 +2,24 @@
    "examType": "GLUCOSE",
    "items": Array [
      Object {
        "examType": "GLUCOSE",
        "flag": "NORMAL",
-       "referenceMax": null,
-       "referenceMin": null,
+       "referenceMax": 99,
+       "referenceMin": 70,
        "resultDate": Any<Date>,
        "resultId": "1",
        "sou |
| 07669857ffb0ce3ee50e620aaa2bdb3e306e87699a96b0b0862427652773b240 | qwen_4b | structured | repair | repair | max_repairs_exceeded | 3 | 3 | Runtime repair exhausted MAX_RUNTIME_REPAIRS=5 attempts |
| 0144d5deb3b78f1110a96f6d106c512e0fab1a5d036d23dd42c58308c6aaa8cb | qwen_coder_7b | structured | jest | jest | runtime_error | 2 | 1 | should update patient with valid data: TypeError: Cannot read properties of undefined (reading 'mockResolvedValue') |
| 037afe15bb26d79e82f3322663411106819143721fb92d30fe6afaf4bf9b342e | falcon_7b | zero_shot | jest | jest | test_discovery_failure | 2 | 1 | FAIL src/order/order.service.spec.ts
  ● Test suite failed to run

    [96msrc/order/order.service.spec.ts[0m:[93m297[0m:[93m82[0m - [91merror[0m[90m TS1109: [0mExpression expected.

    [7m297[0m       { id: '123', encounterId: 'encounter456', examType: ExamType.HEMOGRAM, ... },
    [7m   [0m [91m                                                                                 ~[0m
    [96msrc/order/order.service.spec.ts[0m:[93m298[0m:[93m81[0m - [91merror[0m[90m TS1109: |
| 07669857ffb0ce3ee50e620aaa2bdb3e306e87699a96b0b0862427652773b240 | qwen_coder_3b | structured | repair | repair | max_repairs_exceeded | 2 | 2 | Runtime repair exhausted MAX_RUNTIME_REPAIRS=5 attempts |
| 00d93c78ba6354c769d1095e12cb744e005f7159c5a8ef3087ad1b48afc6594b | gemma_4 | structured | jest | jest | assertion_failure | 2 | 1 | should throw BadRequestException if the patient is inactive: Error: expect(received).rejects.toThrow(expected)

Expected substring: "Cannot admit an inactive patient"
Received message:   "Ward is required for ADT A01 (admission)"

    [0m [90m 65 |[39m   validateEncounterFields(dto[33m:[39m [33mCreateEncounterDto[39m)[33m:[39m [36mvoid[39m {
     [90m 66 |[39m     [36mif[39m (dto[33m.[39madtType [33m===[39m [33mAdtType[39m[33m.[39m[33mA01[39m [33m&&[39m [33m![39mdto |
| 0086279c99e288ed6942452c972e61cd8b228656b0a4a9e4a383eee66340c002 | qwen_coder_3b | zero_shot | jest | jest | unknown | 2 | 1 | should return an empty array when no results are found: Error: Nest can't resolve dependencies of the ResultService (ResultRepository, ?). Please make sure that the argument OrderService at index [1] is available in the RootTestModule module.

Potential solutions:
- Is RootTestModule a valid NestJS module?
- If OrderService is a provider, is it part of the current RootTestModule?
- If OrderService is exported from a separate @Module, is that module imported within RootTestModule?
  @Module({
    |
| 0f11fee3966ed7ac26f65a4fe3777f4bc102308ac224a6528224fb76f181c370 | falcon_7b | structured | jest | jest | runtime_error | 2 | 1 | should handle corrected result: TypeError: Cannot read properties of undefined (reading 'examType') |
| 17aa101a1a6a388daed4232bf873d7a620f9d5cd78bea5afcd7d177ebaa95950 | qwen_coder_3b | few_shot | jest | jest | unknown | 2 | 1 | should find and update an existing patient and encounter for A02: NotFoundException: Encounter with id 1 not found |
| 1b00646d05826949aa7e90edc886a176d744fdb5bf98a858e12ee0b833154e1b | falcon_7b | structured | jest | jest | unexpected_throw | 2 | 1 | should throw NotFoundException if patientService.getPatientById returns null: Error: expect(received).rejects.toThrow()

Received promise resolved instead of rejected
Resolved to value: undefined |
| 38a294a0cfce68fec9c59062a8ebfc79e5ab504db2937bafbd1331f886269ca1 | qwen_coder_3b | structured | jest | jest | assertion_failure | 2 | 1 | should update requestedBy when provided: Error: expect(received).toEqual(expected) // deep equality

Expected: {"requestedBy": "John", "status": "PENDING"}
Received: undefined |
| 37c188bcdbae72485d0368a543e3e8f78124b92c14129bf76a0d82483a7b6ec6 | gemma_4 | few_shot | jest | jest | unexpected_throw | 2 | 1 | should throw ConflictException when CPF already exists: Error: expect(received).rejects.toThrow()

Received promise resolved instead of rejected
Resolved to value: undefined |
| 3a392e0169fc82b3038b5a4a8257e12f9f2bfb4bfe8ab614fdc14b1ba873816d | qwen_coder_7b | zero_shot | jest | jest | unexpected_throw | 2 | 1 | should throw BadRequestException if admitDate is before transferDate: Error: expect(received).rejects.toThrow()

Received promise resolved instead of rejected
Resolved to value: undefined |
| 2fc6f9a2cc31fd02b5b567482346c160ea5500fde3f331ffc3508d4d101c432f | gemma_4 | zero_shot | jest | jest | runtime_error | 2 | 1 | should throw BadRequestException for invalid status transition: TypeError: resultService.updateResult is not a function |
| 2da5823d3713cb747d8b4184573a7cf2d68a578eafc0938e418036160204836f | qwen_coder_3b | zero_shot | jest | jest | unexpected_throw | 2 | 1 | should throw a BadRequestException if the dto is invalid: Error: expect(received).rejects.toThrow()

Received promise resolved instead of rejected
Resolved to value: undefined |
| 1f03e9d4e85340e15b221ee4e30bc87341daecd6f0a3402493388b803c566fde | qwen_4b | few_shot | jest | jest | assertion_failure | 2 | 1 | should return report with all statuses and abnormal count: Error: expect(received).toBe(expected) // Object.is equality

Expected: 2
Received: 1 |
| 2a9eaf3ff3ce7576b93440ff21a4440b83f2c5480e40c0fce30c30c565b276c5 | qwen_4b | few_shot | jest | jest | unknown | 2 | 1 | should update encounter status for A02: NotFoundException: Encounter with id 2 not found |
| 2b4c34228405bc2b2f0aac0fb76a1997a14fa0855a0d248388760ca46c7ec6d1 | qwen_4b | few_shot | jest | jest | assertion_failure | 2 | 1 | should throw BadRequestException when encounter is discharged: Error: expect(received).rejects.toThrow(expected)

Expected constructor: BadRequestException
Received constructor: NotFoundException

Received message: "Encounter with id 1 not found"

    [0m [90m 102 |[39m     [36mconst[39m encounter [33m=[39m [36mawait[39m [36mthis[39m[33m.[39mencounterRepository[33m.[39mfindById(id)[33m;[39m
     [90m 103 |[39m     [36mif[39m ([33m![39mencounter) {
    [31m[1m>[22m[39m |
| 2a9eaf3ff3ce7576b93440ff21a4440b83f2c5480e40c0fce30c30c565b276c5 | qwen_4b | few_shot | jest | jest | runtime_error | 2 | 1 | should create patient and encounter for A01: ReferenceError: serviceMock is not defined |
| 253a48c75b75e6cf14a8959f33f87c3f680fa3ed1d73693a28d02605f33d888b | qwen_4b | zero_shot | jest | jest | runtime_error | 2 | 1 | should create new patient and encounter for A01: ReferenceError: serviceMock is not defined |
| 227baf757851af553b410780858eb2a3a694d3c1e276d37681c34422fc3b4bd6 | qwen_coder_3b | few_shot | jest | jest | unexpected_throw | 2 | 1 | should throw NotFoundException when order does not exist: Error: expect(received).rejects.toThrow()

Received promise resolved instead of rejected
Resolved to value: undefined |
| 07c51382e28e886b28e940d307bc4386b70e101b84f3dc5377768a021ccfc68f | falcon_7b | structured | jest | jest | runtime_error | 2 | 1 | should throw BadRequestException for discharged encounter: TypeError: Cannot read properties of undefined (reading 'mockResolvedValue') |
| 08a2b113294b61c6a03ad1ce444d5898b21e172ead6f0df69f61619865ce6ed5 | qwen_coder_7b | zero_shot | jest | jest | assertion_failure | 2 | 1 | should build encounter summary with no abnormal results and active days less than 7: Error: expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 1

@@ -1,7 +1,7 @@
  Object {
-   "activeDays": 10,
+   "activeDays": 1249,
    "encounter": Object {
      "admitDate": "2023-04-01T00:00:00Z",
      "id": "123",
      "orders": Array [
        Object { |
| 812ab9eca29f24133295de507b150b0135da9514a726d193a6bc950cc3533284 | falcon_7b | structured | jest | jest | runtime_error | 2 | 1 | should save order when order is pending and incomingStatus is FINAL: TypeError: Cannot read properties of undefined (reading 'status') |
| 87c44c1de61df31304d5cff3799561c803d14222b2af810aea8d57618223d73a | qwen_coder_3b | few_shot | jest | jest | assertion_failure | 2 | 1 | should calculate activeDays correctly: Error: expect(received).toBe(expected) // Object.is equality

Expected: 9
Received: 40 |
| 87cf48decd9a4e8fa6c264ca434cad9b4984f505d415e9679632e94bf583f1b8 | qwen_coder_7b | zero_shot | jest | jest | assertion_failure | 2 | 1 | should validate encounter fields: Error: expect(received).toHaveBeenCalledWith(...expected)

Matcher error: received value must be a mock or spy function

Received has type:  function
Received has value: [Function validateEncounterFields] |
| 55b84d82ccdb34849ff92a3b1489be65a537f9706f076c12a5ca6da079fa4593 | falcon_7b | structured | jest | jest | unexpected_throw | 2 | 1 | should throw NotFoundException if patientService.getPatientById returns null: Error: expect(received).rejects.toThrow()

Received promise resolved instead of rejected
Resolved to value: undefined |
| 6397163331131953570f35d28516e30bf346eb68e8cf595b72b59094a8196ba9 | qwen_4b | zero_shot | jest | jest | unknown | 2 | 1 | should update patient successfully when no email conflict exists: NotFoundException: Patient with id 1 not found |
| 4c92a237e576117ffcb575533afe6fd7e95415b2f9ee35f41c02210a318e2280 | qwen_4b | zero_shot | jest | jest | runtime_error | 2 | 1 | should create new patient and encounter for A01: TypeError: Cannot read properties of undefined (reading 'active') |
| 4cef02eeae4f7398267df720cf6938329b98d8c6de52c8a89196d5b3be861c86 | gemma_4 | zero_shot | jest | jest | runtime_error | 2 | 1 | should throw BadRequestException if the order is IN_PROGRESS and requestedBy is provided: TypeError: Cannot read properties of undefined (reading 'mockRejectedValueOnce') |
| 48d6820a1fdfb3c9359c34255bda3cea840d6c4ae9b9255a8be97a63f20a1ae1 | qwen_4b | zero_shot | jest | jest | unexpected_throw | 2 | 1 | should throw BadRequestException when CORRECTED result already exists: Error: expect(received).rejects.toThrow()

Received promise resolved instead of rejected
Resolved to value: {"created_at": 2026-09-01T12:26:49.685Z, "encounter": {"id": "enc-1"}, "encounterId": "enc-1", "examType": "HEMOGRAM", "id": "123", "notes": null, "requestedAt": 2026-09-01T12:26:49.685Z, "requestedBy": "user", "results": [{"id": "res-1", "status": "FINAL"}], "status": "COMPLETED", "updated_at": 2026-09-01T12:26:49.685Z |
| 3fac426fa215679624cff39b144f00a027597189268a95e2569fca10d6cd08e4 | gemma_4 | zero_shot | jest | jest | runtime_error | 2 | 1 | should return the order if found: TypeError: this.getOrderById is not a function |
| 4ae588554e6fa0b9584f51970fafd7ce03f111d67883ee05381e4d8be0663867 | gemma_4 | structured | jest | jest | assertion_failure | 2 | 1 | should calculate summary correctly when an encounter has pending orders and no abnormal results: Error: expect(received).toBe(expected) // Object.is equality

Expected: 1
Received: 0 |
| 4c92a237e576117ffcb575533afe6fd7e95415b2f9ee35f41c02210a318e2280 | qwen_4b | zero_shot | jest | jest | unknown | 2 | 1 | should transfer encounter for A02: NotFoundException: Encounter with id encounter-1 not found |
| 5b30837af7b7247bdbfc5568f7d4a48e2fb2138c44922bd25ff45e50c3049bf0 | qwen_4b | few_shot | jest | jest | assertion_failure | 2 | 1 | should return EncounterSummary with MEDIUM risk flag when has abnormal results and active days <= 7: Error: expect(received).toBe(expected) // Object.is equality

Expected: "MEDIUM"
Received: "LOW" |
| 86e8a44f36272d3e721a36a8a392bc31bd6c899157fe9f086290c85809ec7092 | qwen_coder_7b | few_shot | jest | jest | unexpected_throw | 2 | 1 | should throw BadRequestException when admitDate is in the future: Error: expect(received).rejects.toThrow()

Received promise resolved instead of rejected
Resolved to value: undefined |
| 80aad04adc11cc0270cd364b2f2ee5d85f21cc3ec8a0c389a075cfc49ae9fd89 | qwen_4b | few_shot | jest | jest | assertion_failure | 2 | 1 | should return EncounterSummary with MEDIUM risk flag when has abnormal results and active days <= 7: Error: expect(received).toBe(expected) // Object.is equality

Expected: "MEDIUM"
Received: "LOW" |
| 5f93d6683d1e0fc8322ce9e9fe9de61f26448e681337fea8d678ca09ba3c151c | qwen_4b | few_shot | jest | jest | unknown | 2 | 1 | should update and save order with requestedBy field: BadRequestException: Cannot update requestedBy for an order in progress. Only notes can be updated |
| 55d20b41a910ce062eadb9b7868ea23d10ac97dddf90caab62d7bd0fbd0729cb | falcon_7b | structured | jest | jest | runtime_error | 2 | 1 | should throw ConflictException when cpf already exists: Error: expect(received).rejects.toThrow(expected)

Expected constructor: ConflictException
Received constructor: TypeError

Received message: "Cannot read properties of undefined (reading 'replace')"

    [0m [90m 26 |[39m
     [90m 27 |[39m   [36masync[39m createPatient(dto[33m:[39m [33mCreatePatientDto[39m)[33m:[39m [33mPromise[39m[33m<[39m[33mPatient[39m[33m>[39m {
    [31m[1m>[22m[39m[90m 28 |[39m     [36mcon |
| 61a2f016d12c281209a3fe6aba863d7363d0138a2f5329b1b07e44fcc9996538 | qwen_coder_7b | structured | jest | jest | assertion_failure | 2 | 1 | should handle preliminary results correctly: Error: expect(received).toEqual(expected) // deep equality

- Expected  - 2
+ Received  + 2

@@ -2,12 +2,12 @@
    "examType": "GLUCOSE",
    "items": Array [
      Object {
        "examType": "GLUCOSE",
        "flag": "NORMAL",
-       "referenceMax": null,
-       "referenceMin": null,
+       "referenceMax": 99,
+       "referenceMin": 70,
        "resultDate": Any<Date>,
        "resultId": "1",
        "sourceSystem": null,
        "status": "P |
| 686f7870d49673cbbd89dae77f57975f787ac756388d915de590a64c0ee4b32a | falcon_7b | few_shot | jest | jest | runtime_error | 2 | 1 | should validate order result before creating: ReferenceError: dto is not defined |
| 77bf5287fefa0828a6614227758ef8a4fb5c1afc288fb299f79276f8c3c2bafa | qwen_4b | few_shot | jest | jest | runtime_error | 2 | 1 | should throw BadRequestException when admitDate is a future date: TypeError: Cannot read properties of undefined (reading 'mockResolvedValueOnce') |
| 9b73ccd0074936c767bf8f2216c53721f4b8f093736c7c8b04f308126a5f45f2 | gemma_4 | structured | repair | repair | repair_failed | 2 | 1 | 4 repair attempt(s) did not produce a valid fix |
| 9dc30582227786e700454c32817c4a1fb81f3039c80473ad7e0a608c90123b0d | gemma_4 | structured | jest | jest | assertion_failure | 2 | 1 | should correctly calculate summary and items when results are present and include various statuses: Error: expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 1

@@ -38,11 +38,11 @@
        "value": 75,
      },
    ],
    "orderId": "some-order-id",
    "summary": Object {
-     "abnormal": 0,
+     "abnormal": 1,
      "corrected": 1,
      "final": 1,
      "preliminary": 1,
      "total": 3,
    }, |
| 9861ca053b69d867a6c17101548619e656b1785c8cb3bf0fbbc849f04b952be4 | qwen_coder_7b | few_shot | jest | jest | runtime_error | 2 | 1 | should throw BadRequestException when incoming status is CORRECTED and order does not have exactly one final result: Error: expect(received).rejects.toThrow(expected)

Expected constructor: BadRequestException
Received constructor: TypeError

Received message: "Cannot read properties of undefined (reading 'status')"

    [0m [90m 94 |[39m     )[33m;[39m
     [90m 95 |[39m
    [31m[1m>[22m[39m[90m 96 |[39m     [36mif[39m (encounter[33m.[39mstatus [33m===[39m [33mEncounterStatu |
| 96ae38e360b25ec21a236f82f59dbec2c5ad3f1e5ae84aba3aec2264baa8edb8 | qwen_4b | few_shot | jest | jest | assertion_failure | 2 | 1 | should return EncounterSummary with MEDIUM risk flag when has abnormal results and active days <= 7: Error: expect(received).toBe(expected) // Object.is equality

Expected: "MEDIUM"
Received: "LOW" |
| 9189008d9a77441c1e0424a7baeafe200fc84581777063dffe3f322d472f5ff8 | falcon_7b | structured | jest | jest | unknown | 2 | 1 | should throw ConflictException when updating same email: Error: expect(received).toBeInstanceOf(expected)

Expected constructor: ConflictException
Received constructor: NotFoundException |
| 8da24b4cb548d8e54473247a52c59cdbe0f5e07c63c96ce44c9d1201a99f5215 | qwen_coder_7b | zero_shot | jest | jest | unknown | 2 | 1 | should validate encounter fields: BadRequestException: Ward is required for ADT A01 (admission) |
| bc99277e2a06b5c2707860cc5adde8d97acd2fb5c7f8c76e986bd900bd8d04ef | gemma_4 | zero_shot | jest | jest | unexpected_throw | 2 | 1 | should be able to create an order successfully: BadRequestException: Order date cannot be before admission date |
| bd5bd3cb9c699b84550592c645676c753e2ff97c2bd4e92a8237388e87da2d1e | qwen_coder_7b | structured | jest | jest | runtime_error | 2 | 1 | should update order status to in progress and save if order status is pending and incoming status is final: TypeError: Cannot read properties of undefined (reading 'status') |
| a19dd2f169fea0f558514ac3dac1b23af029a1260819d762429f620cb291dccb | falcon_7b | few_shot | repair | repair | repair_failed | 2 | 2 | 1 repair attempt(s) did not produce a valid fix |
| a19dd2f169fea0f558514ac3dac1b23af029a1260819d762429f620cb291dccb | gemma_4 | structured | repair | repair | repair_failed | 2 | 2 | 1 repair attempt(s) did not produce a valid fix |
| ab3f0349e33bd8da5528188e245697dc2cf45865f4b281756862ed1adf11fb66 | qwen_coder_3b | zero_shot | jest | jest | unexpected_throw | 2 | 1 | should throw a BadRequestException if the order ID is invalid: Error: expect(received).rejects.toThrow()

Received promise resolved instead of rejected
Resolved to value: undefined |
| a5ed3230f230b5456e048a503f995f09206f1d6279952be101bcf362ec6283ea | qwen_coder_3b | structured | jest | jest | unexpected_throw | 2 | 1 | should throw NotFoundException when searchAdvanced returns undefined: Error: expect(received).rejects.toThrow()

Received promise resolved instead of rejected
Resolved to value: undefined |
| b1be89f775c3b2206091a6c11f5234df305cf0aa3e71ac1ed7efbe677646ede5 | falcon_7b | structured | jest | jest | runtime_error | 2 | 1 | should throw ConflictException for existing active encounter: Error: expect(received).rejects.toThrow(expected)

Expected constructor: ConflictException
Received constructor: TypeError

Received message: "Cannot read properties of undefined (reading 'active')"

    [0m [90m 38 |[39m     [36mconst[39m patient [33m=[39m [36mawait[39m [36mthis[39m[33m.[39mpatientService[33m.[39mgetPatientById(dto[33m.[39mpatientId)[33m;[39m
     [90m 39 |[39m
    [31m[1m>[22m[39m[90m 40 | |
| b0ae713356ba12ef16cb18b46a8d2a80e251109bf93fe3451e2ee07d34a705d8 | qwen_4b | few_shot | jest | jest | unknown | 2 | 1 | should update encounter status for A02: NotFoundException: Encounter with id 2 not found |
| b0ae713356ba12ef16cb18b46a8d2a80e251109bf93fe3451e2ee07d34a705d8 | qwen_4b | few_shot | jest | jest | runtime_error | 2 | 1 | should create patient and encounter for A01: TypeError: Cannot read properties of null (reading 'id') |
| b662f6327e99d7eb4e003f51009acbe754672c2a4b7a9a8b1f9117a30a4c437d | falcon_7b | structured | jest | jest | runtime_error | 2 | 1 | should save order when order is pending and incomingStatus is FINAL: TypeError: Cannot read properties of undefined (reading 'status') |
| ca6ad47b2091985e704acc53b5d61285de54ab6b8696931d3cfd4cdacac2beb0 | falcon_7b | structured | jest | jest | assertion_failure | 2 | 1 | should create a result with valid inputs: Error: expect(jest.fn()).toHaveBeenCalledWith(...expected)

- Expected
+ Received

- Object {
-   "notes": "Initial test",
-   "orderId": "123",
-   "referenceMax": 20,
-   "referenceMin": 10,
-   "resultDate": 2023-01-01T00:00:00.000Z,
-   "sourceSystem": "system1",
-   "status": "PRELIMINARY",
-   "unit": "mg/dL",
-   "value": 100,
- }
+ Promise {},

Number of calls: 1 |
| c90be721889c1ac850fbb40716ccc07d35b4421094934cd77c66034450360eb3 | falcon_7b | structured | jest | jest | runtime_error | 2 | 1 | should throw ConflictException for existing active encounter: Error: expect(received).rejects.toThrow(expected)

Expected constructor: ConflictException
Received constructor: TypeError

Received message: "Cannot read properties of undefined (reading 'active')"

    [0m [90m 38 |[39m     [36mconst[39m patient [33m=[39m [36mawait[39m [36mthis[39m[33m.[39mpatientService[33m.[39mgetPatientById(dto[33m.[39mpatientId)[33m;[39m
     [90m 39 |[39m
    [31m[1m>[22m[39m[90m 40 | |
| d46714bef598980eb2ce3298b9bfc14c6a05441f76165baeed065e66443f2144 | qwen_coder_3b | zero_shot | jest | jest | runtime_error | 2 | 1 | should throw a BadRequestException if the dto is invalid: TypeError: expect(...).rejects.toThrowError is not a function |
| dfe2232fcad8ac77805500ca7c1d3756ae3a490b2ff1cfb573b8fed7e36f2cd9 | gemma_4 | structured | jest | jest | unexpected_throw | 2 | 1 | should throw BadRequestException for invalid status transition: Error: expect(received).rejects.toThrow()

Received promise resolved instead of rejected
Resolved to value: undefined |
| d112f738fe620be0b0d7084ef3355342338797a89cfe6a1e8e329f6f415736d0 | falcon_7b | few_shot | jest | jest | test_discovery_failure | 2 | 1 | FAIL src/encounter/encounter.service.spec.ts
  ● Test suite failed to run

    [96msrc/encounter/encounter.service.spec.ts[0m:[93m97[0m:[93m2[0m - [91merror[0m[90m TS1110: [0mType expected.

    [7m97[0m </OUTPUT>
    [7m  [0m [91m ~[0m

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        0.843 s
Ran all test suites matching src\encounter\encounter.service.spec.ts with tests matching "FN_listEncountersByPatient_END".
Test results written to: ..\e |
| cf3f148a8677c1606efc9d9c08b6f8c84f40d87fca29f068b4e585c1d7d50b42 | falcon_7b | structured | jest | jest | unknown | 2 | 1 | should throw ConflictException when updating same email: Error: expect(received).toBeInstanceOf(expected)

Expected constructor: ConflictException
Received constructor: NotFoundException |
| d1cad0f770f067f0fa1b8928a3da3a207d537eb12d2055bbb14c3335a9fedd57 | qwen_coder_3b | structured | jest | jest | unknown | 2 | 1 | should throw BadRequestException for ADT A03 with Wart: BadRequestException: Ward must not be informed for ADT A03 (discharge) |
| d6d6034a1f46a1a3143dd79d268ce6b6f35fd0bcf464821fc884f62056892f27 | qwen_coder_3b | structured | jest | jest | unexpected_throw | 2 | 1 | should throw a NotFoundException when no order is found: Error: expect(received).rejects.toThrow()

Received promise resolved instead of rejected
Resolved to value: [] |
| de3723679a991e156acd440611d552d2b03b291413014233273c8a95c9fbea73 | gemma_4 | structured | jest | jest | runtime_error | 2 | 1 | should handle AdtType A01 successfully by creating an encounter: TypeError: service.createEncounter.mockResolvedValue is not a function |
| e607603bf63fe854c7800d07585d92a75ecd80d670c010833f0db13fb2188de8 | falcon_7b | structured | jest | jest | unknown | 2 | 1 | should throw BadRequestException for transfer without ward: Error: expect(received).toBeInstanceOf(expected)

Expected constructor: BadRequestException
Received constructor: NotFoundException |
| e7278f56575a2198435d2734c984b10311ae3f21a108269b6a1555131fdb30b7 | qwen_coder_7b | zero_shot | jest | jest | unknown | 2 | 1 | should update an existing encounter for A02: NotFoundException: Encounter with id encounterId not found |
| e9965091a10c0efaa5d25074655d40ac6547b0986600d07fbfa723bde7203636 | falcon_7b | structured | jest | jest | runtime_error | 2 | 1 | should throw ConflictException for existing pending order: Error: expect(received).rejects.toThrow(expected)

Expected constructor: ConflictException
Received constructor: TypeError

Received message: "Cannot read properties of undefined (reading 'status')"

    [0m [90m 37 |[39m     )[33m;[39m
     [90m 38 |[39m
    [31m[1m>[22m[39m[90m 39 |[39m     [36mif[39m (encounter[33m.[39mstatus [33m===[39m [33mEncounterStatus[39m[33m.[39m[33mDISCHARGED[39m) {
     [90m    |[39 |
| ef6aa2a6d0dce7831d5f3483edbaa0a68a3653f4fd5ee9c7615e7b106066d419 | falcon_7b | structured | jest | jest | unknown | 2 | 1 | should handle A02 message transition: NotFoundException: Encounter with id encounterId not found |
| f30c9ea5f7be5582772b38b009e85822d1506003342105e87ca4b83f9b16b524 | falcon_7b | structured | jest | jest | unknown | 2 | 1 | should handle A02 message transition: NotFoundException: Encounter with id encounterId not found |
| fe883f0a1c30d6c4265e9337b4318920663bd6d683ac1f9dccc7506e21270cdc | qwen_4b | few_shot | jest | jest | assertion_failure | 2 | 1 | should return EncounterSummary with MEDIUM risk flag when has abnormal results and active days <= 7: Error: expect(received).toBe(expected) // Object.is equality

Expected: "MEDIUM"
Received: "LOW" |
| ff4012f92f473356ef2a1d0f7409aed09ff49b0861e27b7de6fb1be75f71c710 | gemma_4 | zero_shot | jest | jest | assertion_failure | 2 | 1 | should throw BadRequestException if the patient is inactive: Error: expect(received).rejects.toThrow(expected)

Expected substring: "Cannot admit an inactive patient"
Received message:   "Ward is required for ADT A01 (admission)"

    [0m [90m 65 |[39m   validateEncounterFields(dto[33m:[39m [33mCreateEncounterDto[39m)[33m:[39m [36mvoid[39m {
     [90m 66 |[39m     [36mif[39m (dto[33m.[39madtType [33m===[39m [33mAdtType[39m[33m.[39m[33mA01[39m [33m&&[39m [33m![39mdto |

## Events by model x strategy

| model | strategy | total_events | functions_observed | distinct_attempts_logged | events_per_function | events_per_attempt |
| --- | --- | --- | --- | --- | --- | --- |
| falcon_7b | few_shot | 155 | 19 | 133 | 8.16 | 1.17 |
| falcon_7b | structured | 132 | 15 | 58 | 8.8 | 2.28 |
| falcon_7b | zero_shot | 102 | 14 | 71 | 7.29 | 1.44 |
| gemma_4 | few_shot | 28 | 8 | 12 | 3.5 | 2.33 |
| gemma_4 | structured | 69 | 13 | 31 | 5.31 | 2.23 |
| gemma_4 | zero_shot | 83 | 14 | 27 | 5.93 | 3.07 |
| qwen_4b | few_shot | 57 | 11 | 28 | 5.18 | 2.04 |
| qwen_4b | structured | 82 | 9 | 39 | 9.11 | 2.1 |
| qwen_4b | zero_shot | 121 | 11 | 38 | 11.0 | 3.18 |
| qwen_coder_3b | few_shot | 56 | 14 | 18 | 4.0 | 3.11 |
| qwen_coder_3b | structured | 62 | 17 | 40 | 3.65 | 1.55 |
| qwen_coder_3b | zero_shot | 114 | 20 | 74 | 5.7 | 1.54 |
| qwen_coder_7b | few_shot | 33 | 12 | 18 | 2.75 | 1.83 |
| qwen_coder_7b | structured | 46 | 11 | 24 | 4.18 | 1.92 |
| qwen_coder_7b | zero_shot | 54 | 13 | 28 | 4.15 | 1.93 |

## Events by phase

| model | strategy | phase | total_events | functions_observed | distinct_attempts_logged | events_per_function | events_per_attempt |
| --- | --- | --- | --- | --- | --- | --- | --- |
| falcon_7b | few_shot | generation | 4 | 4 | 0 | 1.0 |  |
| falcon_7b | few_shot | jest | 73 | 15 | 68 | 4.87 | 1.07 |
| falcon_7b | few_shot | pipeline | 13 | 13 | 0 | 1.0 |  |
| falcon_7b | few_shot | repair | 65 | 15 | 65 | 4.33 | 1.0 |
| falcon_7b | structured | jest | 120 | 15 | 46 | 8.0 | 2.61 |
| falcon_7b | structured | repair | 12 | 11 | 12 | 1.09 | 1.0 |
| falcon_7b | zero_shot | jest | 69 | 14 | 44 | 4.93 | 1.57 |
| falcon_7b | zero_shot | pipeline | 6 | 6 | 0 | 1.0 |  |
| falcon_7b | zero_shot | repair | 27 | 6 | 27 | 4.5 | 1.0 |
| gemma_4 | few_shot | generation | 2 | 2 | 0 | 1.0 |  |
| gemma_4 | few_shot | jest | 25 | 6 | 11 | 4.17 | 2.27 |
| gemma_4 | few_shot | repair | 1 | 1 | 1 | 1.0 | 1.0 |
| gemma_4 | structured | jest | 63 | 13 | 26 | 4.85 | 2.42 |
| gemma_4 | structured | pipeline | 1 | 1 | 0 | 1.0 |  |
| gemma_4 | structured | repair | 5 | 3 | 5 | 1.67 | 1.0 |
| gemma_4 | zero_shot | generation | 1 | 1 | 0 | 1.0 |  |
| gemma_4 | zero_shot | jest | 74 | 13 | 19 | 5.69 | 3.89 |
| gemma_4 | zero_shot | repair | 8 | 8 | 8 | 1.0 | 1.0 |
| qwen_4b | few_shot | jest | 51 | 11 | 23 | 4.64 | 2.22 |
| qwen_4b | few_shot | pipeline | 1 | 1 | 0 | 1.0 |  |
| qwen_4b | few_shot | repair | 5 | 2 | 5 | 2.5 | 1.0 |
| qwen_4b | structured | generation | 1 | 1 | 0 | 1.0 |  |
| qwen_4b | structured | jest | 65 | 8 | 26 | 8.12 | 2.5 |
| qwen_4b | structured | pipeline | 3 | 3 | 0 | 1.0 |  |
| qwen_4b | structured | repair | 13 | 4 | 13 | 3.25 | 1.0 |
| qwen_4b | zero_shot | jest | 113 | 11 | 31 | 10.27 | 3.65 |
| qwen_4b | zero_shot | pipeline | 1 | 1 | 0 | 1.0 |  |
| qwen_4b | zero_shot | repair | 7 | 5 | 7 | 1.4 | 1.0 |
| qwen_coder_3b | few_shot | generation | 2 | 2 | 0 | 1.0 |  |
| qwen_coder_3b | few_shot | jest | 53 | 12 | 17 | 4.42 | 3.12 |
| qwen_coder_3b | few_shot | repair | 1 | 1 | 1 | 1.0 | 1.0 |
| qwen_coder_3b | structured | jest | 50 | 17 | 30 | 2.94 | 1.67 |
| qwen_coder_3b | structured | pipeline | 2 | 2 | 0 | 1.0 |  |
| qwen_coder_3b | structured | repair | 10 | 2 | 10 | 5.0 | 1.0 |
| qwen_coder_3b | zero_shot | generation | 1 | 1 | 0 | 1.0 |  |
| qwen_coder_3b | zero_shot | jest | 82 | 19 | 48 | 4.32 | 1.71 |
| qwen_coder_3b | zero_shot | pipeline | 5 | 5 | 0 | 1.0 |  |
| qwen_coder_3b | zero_shot | repair | 26 | 6 | 26 | 4.33 | 1.0 |
| qwen_coder_7b | few_shot | jest | 32 | 12 | 17 | 2.67 | 1.88 |
| qwen_coder_7b | few_shot | repair | 1 | 1 | 1 | 1.0 | 1.0 |
| qwen_coder_7b | structured | jest | 40 | 11 | 19 | 3.64 | 2.11 |
| qwen_coder_7b | structured | pipeline | 1 | 1 | 0 | 1.0 |  |
| qwen_coder_7b | structured | repair | 5 | 2 | 5 | 2.5 | 1.0 |
| qwen_coder_7b | zero_shot | jest | 47 | 13 | 22 | 3.62 | 2.14 |
| qwen_coder_7b | zero_shot | pipeline | 1 | 1 | 0 | 1.0 |  |
| qwen_coder_7b | zero_shot | repair | 6 | 2 | 6 | 3.0 | 1.0 |