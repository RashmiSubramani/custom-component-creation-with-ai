# Kissflow LCNC SDK - Consolidated Commands & Snippets

## Initialization / Setup

KFSDK.initialize()`or`kf = await KFSDK.initialize()`→ To initialize the SDK in your app / component. This gives you the`kf` object to interact with.

## App Commands

### App Variables

1. `kf.app.getVariable(variableId)` → Retrieves the value of an app variable.
2. `kf.app.setVariable(variableId, value)` → Sets the value of an app variable.

---

### Page

1. `kf.app.openPage(pageId, { inputParam1: "value1" })` → Opens or navigates to a page.
2. `kf.app.page.getVariable(variableId)` → Retrieves the value of a local variable.
3. `kf.app.page.setVariable(variableId, value)` → Sets the value of a local variable.
4. `kf.app.page.getComponent(componentId)` → Gets a component instance.
5. `componentInstance.refresh()` → Refreshes a component.
6. `componentInstance.hide()` → Hides a component.
7. `componentInstance.show()` → Shows a component.
8. `componentInstance.setActiveTab(2)` → Sets the active tab in a tab component.
9. `componentInstance.setSelectedItem("instanceId")` → Sets the selected item in a component.

---

### Page Popup

10. `kf.app.page.openPopup(popupId, { popupParam1: "value" })` → Opens a popup.
11. `kf.app.page.popup.close()` → Closes the current popup.
12. `kf.app.page.popup.getParameter(parameterId)` → Gets a popup parameter.
13. `kf.app.page.popup.getAllParameters()` → Gets all popup parameters.

---

### Event Parameters

14. `kf.eventParameters._id` → Gets the instance ID.
15. `kf.eventParameters._activity_instance_id` → Gets the activity instance ID.

---

## Common Commands

### General

1. `kf.client.showInfo("message")` → Shows an info message.
2. `kf.api("/url").then((resp) => {}).catch((err) => {})` → Makes a generic API call.
3. `kf.account._id` → Retrieves the current account ID.

---

### Dataform Operations

4. `kf.api("/form/2/{kf.account._id}/{formId}/{instanceId}")` → Gets a form item.
5. `kf.api("/form/2/{kf.account._id}/{formId}/{instanceId}", { method: "POST", body: JSON.stringify(payload) })` → Updates a form item.
6. `kf.api("/form/2/{kf.account._id}/{formId}/{instanceId}", { method: "DELETE" })` → Deletes a form item.
7. `kf.api("/form/2/{kf.account._id}/{formId}/", { method: "POST", body: JSON.stringify(payload) })` → Creates a new form item.
8. `kf.api("/form/2/{kf.account._id}/{formId}/list")` → Lists all items in Form.

---

### Case Operations

8. `kf.api("/case/2/{kf.account._id}/{caseId}/", { method: "POST", body: JSON.stringify(payload) })` → Creates a new case item.

---

### Process Operations

9. `kf.api("/process/2/{kf.account._id}/{processId}/", { method: "POST", body: JSON.stringify(payload) })` → Creates a new process item.
