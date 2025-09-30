
# 📧 Troubleshooting Guide: Unable To Find Sent Emails in Outlook

## Issue Description

Users may experience situations where sent emails are missing from the mailbox and were never delivered. This may occur due to temporary sync or connectivity issues.

---

## ✅ Resolution Steps

### 1. Check Outlook Sync Status

* Look at the bottom-right corner of Outlook.
* Confirm it shows **Connected to: Microsoft Exchange** or **Connected**.
* If it displays **Disconnected** or **Trying to connect**, emails may not send.

---

### 2. Monitor the Outbox Folder

* Open the **Outbox** folder.
* If emails are stuck there, they haven’t been sent.
* Options:

  * Open the email and click **Send** again.
  * Restart Outlook to trigger delivery.

---

### 3. Enable Cached Exchange Mode

Improves performance and reliability.

* Go to:
  **File** → **Account Settings** → **Account Settings** → **Change**
* Check: **Use Cached Exchange Mode**

---

### 4. Perform a Content Search (Admin Only)

#### Step 1: Access the Compliance Portal

* Go to [Microsoft Compliance Portal](https://compliance.microsoft.com)
* Sign in with **Admin credentials**

#### Step 2: Navigate to Content Search

* From the left menu, select:

  * **Data lifecycle management** → **Content search**
  * or go via **Solutions** → **Search**

#### Step 3: Create a New Search

* Click **New search**
* Enter a **name** for the search
* Choose locations to search:

  * Example: **Exchange mailboxes**

#### Step 4: Define Search Conditions

* Use keywords, dates, or filters:

  * Example: `subject:"Invoice"`
  * Example: `from:user@domain.com`
* Advanced filtering: Use **KQL (Keyword Query Language)**

#### Step 5: Start the Search

* Click **Submit**
* The search runs in the background
* Monitor progress in the search list

#### Step 6: Review & Export Results

* Once complete, click the **search name**
* You can:

  * **Preview results**
  * Or **Export results**

    * Choose export format (e.g., **PST for emails**)
    * Download the export key
    * Use the **eDiscovery Export Tool** to download data

---

## 📌 Next Step

* If the issue reoccurs, contact support for further investigation.

