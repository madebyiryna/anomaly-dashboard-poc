import React from "react"
import { GlobalHeader } from "@/components/global-header"

export default function DocumentationPage() {
  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader currentPage="documentation" />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-4">Documentation</h1>
            <p className="text-lg text-muted-foreground">
              Comprehensive overview of the NY Oncology Data Product, including data sources, 
              anomaly detection rules, and business logic.
            </p>
          </div>

          <div className="space-y-8">
            {/* Product Overview */}
            <section className="bg-card rounded-lg p-6 border">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Product Overview</h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-muted-foreground mb-4">
                  The NY Oncology Data Product is a comprehensive anomaly detection dashboard designed 
                  to identify data quality issues, business rule violations, and unusual patterns in 
                  medical and pharmacy claims data. The system processes claims from 2020-2023 and 
                  applies multiple layers of validation to ensure data integrity and clinical accuracy.
                </p>
              </div>
            </section>

            {/* Data Sources */}
            <section className="bg-card rounded-lg p-6 border">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Data Sources</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-2">Medical Claims Data</h3>
                  <p className="text-muted-foreground">
                    Contains patient demographics, diagnosis codes (ICD-10), service dates, 
                    financial amounts, and provider information.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-2">Pharmacy Claims Data</h3>
                  <p className="text-muted-foreground">
                    Includes prescription details, drug codes (HCPCS), quantities, days supply, 
                    and prescriber information.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-2">Data Joining Logic</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li><strong>Strict match:</strong> Patient_ID + Provider_ID/Prescriber_NPI + Drug (normalized)</li>
                    <li><strong>Relaxed match:</strong> Patient_ID + Drug (±14-day window)</li>
                    <li>String normalization: trim, lowercase drug names, unify spaces</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Anomaly Detection Rules */}
            <section className="bg-card rounded-lg p-6 border">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Anomaly Detection Rules</h2>
              
              {/* Data Quality Rules */}
              <div className="mb-6">
                <h3 className="text-xl font-medium text-foreground mb-3">Data Quality (DQ)</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-muted/50 rounded-md">
                    <h4 className="font-medium text-foreground">Missing columns</h4>
                    <p className="text-sm text-muted-foreground">One or more required columns aren't present in the file (schema drift).</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-md">
                    <h4 className="font-medium text-foreground">Duplicate Claim_ID</h4>
                    <p className="text-sm text-muted-foreground">The same Claim_ID appears on multiple rows.</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-md">
                    <h4 className="font-medium text-foreground">Negative amounts</h4>
                    <p className="text-sm text-muted-foreground">Any of Charge_Amount, Allowed_Amount, Paid_Amount, Patient_Responsibility, Adjustment_Amount is negative.</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-md">
                    <h4 className="font-medium text-foreground">Charge magnified</h4>
                    <p className="text-sm text-muted-foreground">Charge_Amount is unreasonably large vs peer rows (synthetic "magnified" charges).</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-md">
                    <h4 className="font-medium text-foreground">Invalid ICD-10</h4>
                    <p className="text-sm text-muted-foreground">Diagnosis_Code_Primary equals an impossible value (e.g., X999).</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-md">
                    <h4 className="font-medium text-foreground">Invalid HCPCS</h4>
                    <p className="text-sm text-muted-foreground">Drug_HCPCS_Code equals an impossible value (e.g., ZZZ99).</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-md">
                    <h4 className="font-medium text-foreground">Invalid Place of Service</h4>
                    <p className="text-sm text-muted-foreground">Place_of_Service_Code set to a non-existent code (e.g., 99).</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-md">
                    <h4 className="font-medium text-foreground">Age out of range</h4>
                    <p className="text-sm text-muted-foreground">Patient_Age &lt; 0 or &gt; 120 (also flags specific bad ages like −5, 0, 121, 150).</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-md">
                    <h4 className="font-medium text-foreground">Gender invalid</h4>
                    <p className="text-sm text-muted-foreground">Patient_Gender not in {'{M, F}'} (e.g., U, X, ??).</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-md">
                    <h4 className="font-medium text-foreground">Dates outside window</h4>
                    <p className="text-sm text-muted-foreground">Any claim date lands outside the expected study period (2020–2023).</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-md">
                    <h4 className="font-medium text-foreground">ZIP out of state</h4>
                    <p className="text-sm text-muted-foreground">State='NY' but ZIP is not a New York ZIP (e.g., 07001, 07302, 20001, 33101, 90001).</p>
                  </div>
                </div>
              </div>

              {/* Smart DQ Rules */}
              <div className="mb-6">
                <h3 className="text-xl font-medium text-foreground mb-3">"Smart" DQ (Cross-field Logic)</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-muted/50 rounded-md">
                    <h4 className="font-medium text-foreground">Service interval reversed</h4>
                    <p className="text-sm text-muted-foreground">Service_To_Date is earlier than Service_From_Date.</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-md">
                    <h4 className="font-medium text-foreground">Adjudicated before submitted</h4>
                    <p className="text-sm text-muted-foreground">Claim_Adjudication_Date is earlier than Claim_Submission_Date.</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-md">
                    <h4 className="font-medium text-foreground">Admission after discharge</h4>
                    <p className="text-sm text-muted-foreground">Admission_Date occurs after Discharge_Date.</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-md">
                    <h4 className="font-medium text-foreground">Unreasonable length of stay</h4>
                    <p className="text-sm text-muted-foreground">Inpatient stay exceeds 365 days.</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-md">
                    <h4 className="font-medium text-foreground">State ↔ ZIP mismatch (NY)</h4>
                    <p className="text-sm text-muted-foreground">ZIP code doesn't correspond to State='NY'.</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-md">
                    <h4 className="font-medium text-foreground">Allowed &gt; Billed</h4>
                    <p className="text-sm text-muted-foreground">Allowed_Amount exceeds Charge_Amount.</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-md">
                    <h4 className="font-medium text-foreground">Allowed &lt; Paid</h4>
                    <p className="text-sm text-muted-foreground">Allowed_Amount is less than Paid_Amount.</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-md">
                    <h4 className="font-medium text-foreground">Paid + Adjusted &gt; Billed</h4>
                    <p className="text-sm text-muted-foreground">Paid_Amount + Adjustment_Amount exceeds Charge_Amount.</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-md">
                    <h4 className="font-medium text-foreground">Claim "Reversed" but non-zero $$</h4>
                    <p className="text-sm text-muted-foreground">Claim_Status='Reversed' while any financial amount is still non-zero.</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-md">
                    <h4 className="font-medium text-foreground">Claim "Denied" but Paid &gt; 0</h4>
                    <p className="text-sm text-muted-foreground">Claim_Status='Denied' yet Paid_Amount is positive.</p>
                  </div>
                </div>
              </div>

              {/* Business Rules */}
              <div className="mb-6">
                <h3 className="text-xl font-medium text-foreground mb-3">Business Rules (Clinical/Benefit Logic)</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-muted/50 rounded-md">
                    <h4 className="font-medium text-foreground">Male with female-only diagnoses</h4>
                    <p className="text-sm text-muted-foreground">Patient_Gender='M' but ICD-10 indicates a female-only condition (e.g., pregnancy/breast: prefixes O, Z34, Z12.31, N60, N63).</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-md">
                    <h4 className="font-medium text-foreground">Female with male-only diagnoses</h4>
                    <p className="text-sm text-muted-foreground">Patient_Gender='F' but ICD-10 indicates a male-specific condition (e.g., prostate/BPH/screening: C61, N40, Z12.5).</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-md">
                    <h4 className="font-medium text-foreground">Female on male-only drug</h4>
                    <p className="text-sm text-muted-foreground">Patient_Gender='F' with a drug typically used only for male urology (e.g., tamsulosin, finasteride, dutasteride, alfuzosin, silodosin).</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-md">
                    <h4 className="font-medium text-foreground">Male on female-associated drug</h4>
                    <p className="text-sm text-muted-foreground">Patient_Gender='M' with a drug commonly associated with female oncology/endocrine care (e.g., tamoxifen, letrozole, anastrozole, clomiphene, medroxyprogesterone).</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-md">
                    <h4 className="font-medium text-foreground">Drug ↔ diagnosis mismatch</h4>
                    <p className="text-sm text-muted-foreground">The prescribed drug doesn't match the diagnosis family it's expected to treat (e.g., tamsulosin not paired with BPH/prostate codes like N40/C61/Z12.5, or tamoxifen not paired with breast cancer codes C50/Z17).</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-md">
                    <h4 className="font-medium text-foreground">Pediatric on adult urology drugs</h4>
                    <p className="text-sm text-muted-foreground">Patient appears &lt; 13 years old while receiving adult urology medication.</p>
                  </div>
                </div>
              </div>

              {/* Pharmacy Analytics */}
              <div className="mb-6">
                <h3 className="text-xl font-medium text-foreground mb-3">Pharmacy Analytics (Dataset-level)</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-muted/50 rounded-md">
                    <h4 className="font-medium text-foreground">Repeated claim</h4>
                    <p className="text-sm text-muted-foreground">Same patient+prescriber+product+date+qty+days, different IDs — likely duplicate submissions across systems.</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-md">
                    <h4 className="font-medium text-foreground">Abnormal quantity outlier</h4>
                    <p className="text-sm text-muted-foreground">Quantity is outside product's IQR fence (±3×IQR).</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-md">
                    <h4 className="font-medium text-foreground">Provider inactivity/burst</h4>
                    <p className="text-sm text-muted-foreground">≥120-day inactivity gaps or sudden 7-day bursts (≥4 claims).</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-md">
                    <h4 className="font-medium text-foreground">Monthly robust z-score spike/dip</h4>
                    <p className="text-sm text-muted-foreground">Provider×product or national×product monthly paid deviates (MAD-based |z|&gt;3).</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-md">
                    <h4 className="font-medium text-foreground">Vendor revision delta (v1 vs v2)</h4>
                    <p className="text-sm text-muted-foreground">Monthly paid totals changed materially between vendor drops; shows absolute and % deltas.</p>
                  </div>
                </div>
              </div>

              {/* Peer-normalized Anomaly Detection */}
              <div>
                <h3 className="text-xl font-medium text-foreground mb-3">Peer-normalized Anomaly Detection (Explainable + Model-based)</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-muted/50 rounded-md">
                    <h4 className="font-medium text-foreground">Manual peer outlier (zMAD)</h4>
                    <p className="text-sm text-muted-foreground">Within each brand (drug), the provider's metric (e.g., cost-per-claim, paid-per-unit, paid-per-day) is an extreme peer deviation (|zMAD| &gt; 4.5).</p>
                    <p className="text-sm text-muted-foreground mt-2"><strong>Why flagged?</strong> "Provider's cost-per-claim is far from peer median for this drug."</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-md">
                    <h4 className="font-medium text-foreground">Isolation Forest outlier (per brand)</h4>
                    <p className="text-sm text-muted-foreground">Using peer-normalized features (zMAD of cost-per-claim, paid-median, paid-per-unit/day, days, claim volume), the provider×brand point is isolated by the model.</p>
                    <p className="text-sm text-muted-foreground mt-2"><strong>Why flagged?</strong> "Unusual combination of peer-normalized features for this drug; top deviating feature is X with |z|=Y."</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
