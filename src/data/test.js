export const SDK_DUMMY = `var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj)) throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};
var __privateMethod = (obj, member, method) => {
  __accessCheck(obj, member, "access private method");
  return method;
};
var _listeners,
  _textEncoder,
  _textDecoder,
  _registerComponentAPIs,
  registerComponentAPIs_fn;
let nanoid = (size = 21) =>
  crypto.getRandomValues(new Uint8Array(size)).reduce((id, byte) => {
    byte &= 63;
    if (byte < 36) {
      id += byte.toString(36);
    } else if (byte < 62) {
      id += (byte - 26).toString(36).toUpperCase();
    } else if (byte > 62) {
      id += "-";
    } else {
      id += "_";
    }
    return id;
  }, "");
const LISTENER_CMDS = {
  API: "API",
  GET_CONTEXT: "GET_CONTEXT",
  RETURN: "RETURN",
  GET_FORM_FIELD: "GET_FORM_FIELD",
  UPDATE_FORM: "UPDATE_FORM",
  GET_TABLE: "GET_TABLE",
  GET_TABLE_ROW: "GET_TABLE_ROW",
  ADD_TABLE_ROW: "ADD_TABLE_ROW",
  ADD_TABLE_ROWS: "ADD_TABLE_ROWS",
  DELETE_TABLE_ROW: "DELETE_TABLE_ROW",
  TO_JSON: "TO_JSON",
  GET_TABLE_ROWS: "GET_TABLE_ROWS",
  GET_SELECTED_TABLE_ROWS: "GET_SELECTED_TABLE_ROWS",
  MESSAGE: "MESSAGE",
  CONFIRM: "CONFIRM",
  ALERT: "ALERT",
  REDIRECT: "REDIRECT",
  OPEN_PAGE: "OPEN_PAGE",
  FORMAT_DATE: "FORMAT_DATE",
  FORMAT_DATE_TIME: "FORMAT_DATE_TIME",
  FORMAT_NUMBER: "FORMAT_NUMBER",
  FORMAT_CURRENCY: "FORMAT_CURRENCY",
  FORMAT_BOOLEAN: "FORMAT_BOOLEAN",
  GET_APP_VARIABLE: "GET_APP_VARIABLE",
  SET_APP_VARIABLE: "SET_APP_VARIABLE",
  GET_PAGE_VARIABLE: "GET_PAGE_VARIABLE",
  SET_PAGE_VARIABLE: "SET_PAGE_VARIABLE",
  GET_PAGE_PARAMS: "GET_PAGE_PARAMS",
  GET_ALL_PAGE_PARAMS: "GET_ALL_PAGE_PARAMS",
  PAGE_ON_CLOSE: "PAGE_ON_CLOSE",
  OPEN_POPUP: "OPEN_POPUP",
  GET_POPUP_PARAMS: "GET_POPUP_PARAMS",
  GET_ALL_POPUP_PARAMS: "GET_ALL_POPUP_PARAMS",
  CLOSE_POPUP: "CLOSE_POPUP",
  COMPONENT_GET: "COMPONENT_GET",
  COMPONENT_REFRESH: "COMPONENT_REFRESH",
  COMPONENT_SHOW: "COMPONENT_SHOW",
  COMPONENT_HIDE: "COMPONENT_HIDE",
  COMPONENT_ADD_EVENT_LISTENER: "COMPONENT_ADD_EVENT_LISTENER",
  CC_INITIALIZE: "CC_INITIALIZE",
  CC_WATCH_PARAMS: "CC_WATCH_PARAMS",
  WINDOW_NDEF_READER_NEW: "WINDOW_NDEF_READER_NEW",
  WINDOW_NDEF_READER_SCAN: "WINDOW_NDEF_READER_SCAN",
  WINDOW_NDEF_READER_WRITE: "WINDOW_NDEF_READER_WRITE",
  WINDOW_NDEF_READER_ADD_EVENT_LISTENER:
    "WINDOW_NDEF_READER_ADD_EVENT_LISTENER",
  WINDOW_NDEF_READER_MAKE_READONLY: "WINDOW_NDEF_READER_MAKE_READONLY",
  WINDOW_NDEF_READER_ABORT_SCAN: "WINDOW_NDEF_READER_ABORT_SCAN",
  DECISION_TABLE_EXECUTE: "DECISION_TABLE_EXECUTE",
  DATAFORM_IMPORT_CSV: "DATAFORM_IMPORT_CSV",
  DATAFORM_OPEN_FORM: "DATAFORM_OPEN_FORM",
  PROCESS_OPEN_FORM: "PROCESS_OPEN_FORM",
  BOARD_IMPORT_CSV: "BOARD_IMPORT_CSV",
  BOARD_OPEN_FORM: "BOARD_OPEN_FORM",
};
const EVENT_TYPES = {
  COMPONENT_ON_MOUNT: "componentOnMount",
  CC_ON_PARAMS_CHANGE: "onCustomComponentParamsChange",
};
const DEFAULTS = {
  POPUP_ID: "ACTIVE_POP_UP",
};
function generateId(prefix = "lcncsdk") {
   return \`\${prefix}-\${nanoid()}\`;
}
const globalInstances = {};
function processResponse(req, resp) {
  if (
    resp &&
    Object.keys(resp).length === 1 &&
    req.command !== LISTENER_CMDS.API
  ) {
    let value = Object.values(resp)[0];
    if (value === "undefined") return void 0;
    return value;
  } else {
    return resp;
  }
}
function postMessage(args) {
  if (globalThis.parent && globalThis.parent !== globalThis) {
    globalThis.parent.postMessage(args, "*");
  } else {
    globalThis.postMessage(args);
  }
}
function onMessage(event) {
  if (event.origin !== globalThis.location.origin) {
    const data = event.data;
    if (data == null ? void 0 : data.isEvent) {
      const { target, eventParams, eventName, eventConfig = {} } = data;
      let targetInstance = globalInstances[target];
      targetInstance._dispatchEvent(eventName, eventParams);
      if (eventConfig.once) {
        targetInstance._removeEventListener(eventName);
      }
      return;
    }
    let { _req: req, resp } = data;
    if (req == null ? void 0 : req._id) {
      let targetInstance = globalInstances[req._id];
      targetInstance._dispatchMessageEvents(req, resp);
    }
  }
}
globalThis.addEventListener("message", onMessage);
class EventBase {
  constructor() {
    __privateAdd(this, _listeners, void 0);
    __privateSet(this, _listeners, {});
  }
  _addEventListener(eventName, callBack) {
    var _a;
    __privateGet(this, _listeners)[eventName] =
      ((_a = __privateGet(this, _listeners)) == null
        ? void 0
        : _a[eventName]) || [];
    __privateGet(this, _listeners)[eventName].push(callBack);
  }
  _removeEventListener(eventName, callBack) {
    if (callBack) {
      let index2 = __privateGet(this, _listeners)[eventName].findIndex(
        callBack
      );
      index2 > -1 &&
        __privateGet(this, _listeners)[eventName].splice(index2, 1);
      return;
    }
    Reflect.deleteProperty(__privateGet(this, _listeners), eventName);
  }
  _dispatchEvent(eventName, eventParams) {
    if (Array.isArray(__privateGet(this, _listeners)[eventName])) {
      __privateGet(this, _listeners)[eventName].forEach((callBack) =>
        callBack(eventParams)
      );
      return true;
    }
    return false;
  }
  _dispatchMessageEvents(req, resp) {
    let target = req._id;
    if (Array.isArray(__privateGet(this, _listeners)[target])) {
      __privateGet(this, _listeners)[target].forEach((listener) => {
        try {
          let processedResp = processResponse(req, resp);
          listener(processedResp);
        } catch (err) {
          console.error("Message callback error: ", err);
        }
      });
      this._removeEventListener(target);
    }
  }
}
_listeners = new WeakMap();
class BaseSDK extends EventBase {
  _postMessageAsync(command, args, hasCallBack, callBack) {
  console.info("Inside basesdk")
    return new Promise((resolve, reject) => {
         
      const _id = generateId(command.toLowerCase());
  
      postMessage({ _id, command, ...args });
          
      globalInstances[_id] = this;
      console.info("Inside basesdk promise")
      this._addEventListener(_id, async (data) => {
        console.info("Inside basesdk event listener")
        if (
          (data == null ? void 0 : data.errorMessage) ||
          (data == null ? void 0 : data.isError)
        ) {
          console.info("Inside basesdk if")
          reject(data);
        } else {
            console.info("Inside basesdk else")
          if (hasCallBack && callBack) {
            data = await callBack(data);
          }
          resolve(data);
        }
      });
    });
  }
  _postMessage(command, args, callBack) {
    const _id = generateId(command.toLowerCase());
    postMessage({ _id, command, ...args });
    if (callBack) {
      this._addEventListener(args.eventName, callBack);
    }
  }
_postMessageSync(command, args) {
  const initialValue = 0;
  const _id = generateId(command.toLowerCase());
  const data = { _id, command, ...args };

  const atomics = new AtomicsHandler();
  atomics.reset();
  atomics.store(0, initialValue);
  atomics.encodeData(1, data);

  postMessage(atomics.sab);

  atomics.wait(0, initialValue, 1e4);

  const decodedData = atomics.decodeData();
  const { _req: req, resp } = decodedData;

  const processedResp = processResponse(req, resp);

  if (processedResp?.isError) {
    throw new Error(\`Error: \${JSON.stringify(processedResp, null, 2)}\`);
  }

  return processedResp;
}

}
let sharedArrayBufferInstance;
class AtomicsHandler {
  constructor() {
    __privateAdd(this, _textEncoder, void 0);
    __privateAdd(this, _textDecoder, void 0);
    __privateSet(this, _textEncoder, new TextEncoder());
    __privateSet(this, _textDecoder, new TextDecoder());
    sharedArrayBufferInstance =
      sharedArrayBufferInstance || new SharedArrayBuffer(1024 * 1024);
    this.sab = sharedArrayBufferInstance;
    this.int32Array = new Int32Array(this.sab);
  }
  load(index2 = 0) {
    return Atomics.load(this.int32Array, index2);
  }
  store(index2 = 0, data) {
    return Atomics.store(this.int32Array, index2, data);
  }
  reset() {
    return this.int32Array.fill(0);
  }
  notify(index2 = 0, count = 1) {
    return Atomics.notify(this.int32Array, index2, count);
  }
  wait(index2, value, timeout) {
    return Atomics.wait(this.int32Array, index2, value, timeout);
  }
  encodeData(index2 = 0, data) {
    const replacer = (key, value) => (value === void 0 ? "undefined" : value);
    let string = JSON.stringify(data, replacer);
    let encodedData = __privateGet(this, _textEncoder).encode(string);
    this.int32Array.set(encodedData, index2);
    return this.int32Array;
  }
  decodeData() {
    let uInt8Array = new Uint8Array(this.int32Array);
    let string = __privateGet(this, _textDecoder)
      .decode(uInt8Array)
      .replaceAll(/\x00/g, "");
    return JSON.parse(string);
  }
}
_textEncoder = new WeakMap();
_textDecoder = new WeakMap();
class Client extends BaseSDK {
  showInfo(message) {
    return super._postMessageAsync(LISTENER_CMDS.MESSAGE, { message });
  }
  showConfirm(args) {
    return super._postMessageAsync(LISTENER_CMDS.CONFIRM, {
      data: {
        title: args.title,
        content: args.content,
        okText: args.okText || "Ok",
        cancelText: args.cancelText || "Cancel",
      },
    });
  }
  redirect(url) {
    return super._postMessageAsync(LISTENER_CMDS.REDIRECT, { url });
  }
}
class Formatter extends BaseSDK {
  toDate(date) {
    return this._postMessageAsync(LISTENER_CMDS.FORMAT_DATE, {
      date,
    });
  }
  toDateTime(date) {
    return this._postMessageAsync(LISTENER_CMDS.FORMAT_DATE_TIME, {
      date,
    });
  }
  toNumber(value) {
    return this._postMessageAsync(LISTENER_CMDS.FORMAT_NUMBER, {
      value,
    });
  }
  toCurrency(value, currencyCode) {
    return this._postMessageAsync(LISTENER_CMDS.FORMAT_CURRENCY, {
      value,
      currencyCode,
    });
  }
  toBoolean(value) {
    return this._postMessageAsync(LISTENER_CMDS.FORMAT_BOOLEAN, {
      value,
    });
  }
}
class Component extends BaseSDK {
  constructor(props) {
    super();
    __privateAdd(this, _registerComponentAPIs);
    this._id = props.componentId;
    this.type = "Component";
    globalInstances[this._id] = this;
    __privateMethod(
      this,
      _registerComponentAPIs,
      registerComponentAPIs_fn
    ).call(this, props.componentMethods);
  }
  onMount(callback) {
    this._postMessage(
      LISTENER_CMDS.COMPONENT_ADD_EVENT_LISTENER,
      {
        id: this._id,
        eventName: EVENT_TYPES.COMPONENT_ON_MOUNT,
        eventConfig: {
          once: true,
        },
      },
      callback
    );
  }
  refresh() {
    return this._postMessageAsync(LISTENER_CMDS.COMPONENT_REFRESH, {
      id: this._id,
    });
  }
  show() {
    return this._postMessageAsync(LISTENER_CMDS.COMPONENT_SHOW, {
      id: this._id,
    });
  }
  hide() {
    return this._postMessageAsync(LISTENER_CMDS.COMPONENT_HIDE, {
      id: this._id,
    });
  }
}
  _registerComponentAPIs = new WeakSet();

registerComponentAPIs_fn = function (componentAPIs) {
  componentAPIs?.forEach((Api) => {
    this[Api.name] = (...args) => {
      if (Api.type === "method") {
        return this._postMessageAsync(\`COMPONENT_\${Api.name}\`, {
          id: this._id,
          parameters: args,
        });
      } else if (Api.type === "event") {
        this._postMessage(
          LISTENER_CMDS.COMPONENT_ADD_EVENT_LISTENER,
          {
            id: this._id,
            eventName: Api.name,
            eventConfig: args[1],
          },
          args[0]
        );
      }
    };
  });
};

class CustomComponent extends BaseSDK {
  constructor(id) {
    super();
    this._id = id;
    this.type = "CustomComponent";
    globalInstances[this._id] = this;
  }
  watchParams(callBack) {
    this._postMessage(
      LISTENER_CMDS.CC_WATCH_PARAMS,
      {
        id: this._id,
        eventName: EVENT_TYPES.CC_ON_PARAMS_CHANGE,
        eventConfig: {
          once: false,
        },
      },
      callBack
    );
  }
}
class Popup extends BaseSDK {
  constructor(props) {
    super();
    this.type = "Popup";
    this._id = props.popupId || DEFAULTS.POPUP_ID;
  }
  getParameter(key) {
    return this._postMessageAsync(LISTENER_CMDS.GET_POPUP_PARAMS, {
      key,
      popupId: this._id,
    });
  }
  getAllParameters() {
    return this._postMessageAsync(LISTENER_CMDS.GET_ALL_POPUP_PARAMS, {
      popupId: this._id,
    });
  }
  close() {
    return this._postMessageAsync(LISTENER_CMDS.CLOSE_POPUP, {});
  }
  getComponent(componentId) {
    return this._postMessageAsync(
      LISTENER_CMDS.COMPONENT_GET,
      { componentId },
      true,
      (data) => {
        return new Component(data);
      }
    );
  }
}
class Page extends BaseSDK {
  constructor(props, isCustomComponent = false) {
    super();
    this.type = "Page";
    this.popup = new Popup({});
    this._id = props.pageId;
  }
  getParameter(key) {
    return this._postMessageAsync(LISTENER_CMDS.GET_PAGE_PARAMS, {
      key,
    });
  }
  getAllParameters() {
    return this._postMessageAsync(LISTENER_CMDS.GET_ALL_PAGE_PARAMS, {
      pageId: this._id,
    });
  }
  getVariable(key) {
    return this._postMessageAsync(LISTENER_CMDS.GET_PAGE_VARIABLE, {
      key,
    });
  }
  setVariable(key, value) {
    return this._postMessageAsync(LISTENER_CMDS.SET_PAGE_VARIABLE, {
      key,
      value,
    });
  }
  openPopup(popupId, popupParams) {
    return this._postMessageAsync(LISTENER_CMDS.OPEN_POPUP, {
      popupId,
      popupParams,
    });
  }
  getComponent(componentId) {
    return this._postMessageAsync(
      LISTENER_CMDS.COMPONENT_GET,
      { componentId },
      true,
      (data) => new Component(data)
    );
  }
}
class DecisionTable extends BaseSDK {
  constructor(flowId) {
    super();
    this.flowId = flowId;
  }
  evaluate(payload) {
    return this._postMessageAsync(LISTENER_CMDS.DECISION_TABLE_EXECUTE, {
      flowId: this.flowId,
      payload,
    });
  }
}
class Dataform extends BaseSDK {
  constructor(flowId) {
    super();
    this._id = flowId;
  }
  importCSV(defaultValues) {
    return this._postMessageAsync(LISTENER_CMDS.DATAFORM_IMPORT_CSV, {
      flowId: this._id,
      defaultValues,
    });
  }
  openForm(item) {
    if (!item._id) {
      return Promise.reject({
        message: "Instance Id (_id) is required",
      });
    }
    return this._postMessageAsync(LISTENER_CMDS.DATAFORM_OPEN_FORM, {
      flowId: this._id,
      itemId: item._id,
    });
  }
}
class Board extends BaseSDK {
  constructor(flowId) {
    super();
    this._id = flowId;
  }
  importCSV(defaultValues) {
    return this._postMessageAsync(LISTENER_CMDS.BOARD_IMPORT_CSV, {
      flowId: this._id,
      defaultValues,
    });
  }
  openForm(item) {
    if (!item._id) {
      return Promise.reject({
        message: "Instance Id (_id) is required",
      });
    }
    return this._postMessageAsync(LISTENER_CMDS.BOARD_OPEN_FORM, {
      flowId: this._id,
      itemId: item._id,
      viewId: item._view_id,
    });
  }
}
class Process extends BaseSDK {
  constructor(flowId) {
    super();
    this._id = flowId;
  }
  openForm(item) {
    if (!item._id || !item._activity_instance_id) {
      return Promise.reject({
        message:
          "Instance Id(_id) and Activity Instance Id(_activity_instance_id) are required",
      });
    }
    return this._postMessageAsync(LISTENER_CMDS.PROCESS_OPEN_FORM, {
      flowId: this._id,
      instanceId: item._id,
      activityInstanceId: item._activity_instance_id,
    });
  }
}
class Application extends BaseSDK {
  constructor(props, isCustomComponent = false) {
    super();
    this._id = props.appId;
    this.page = new Page(props);
  }
  getVariable(key) {
    return this._postMessageAsync(LISTENER_CMDS.GET_APP_VARIABLE, {
      key,
    });
  }
  setVariable(key, value) {
    return this._postMessageAsync(LISTENER_CMDS.SET_APP_VARIABLE, {
      key,
      value,
    });
  }
  openPage(pageId, pageParams) {
    return this._postMessageAsync(LISTENER_CMDS.OPEN_PAGE, {
      pageId,
      pageParams,
    });
  }
  getDecisionTable(flowId) {
    return new DecisionTable(flowId);
  }
  getDataform(flowId) {
    return new Dataform(flowId);
  }
  getBoard(flowId) {
    return new Board(flowId);
  }
  getProcess(flowId) {
    return new Process(flowId);
  }
}
class CustomComponentSDK extends BaseSDK {
  constructor() {
    super();
  }
  api(url, args) {
    return this._postMessageAsync(LISTENER_CMDS.API, { url, args: args || {} });
  }
  initialize() {
   console.info("Inside initialize");
    if (globalThis.parent && globalThis.parent === globalThis) {
    console.info("Inside initialize if");
      return Promise.reject(
        "SDK can be initialized only inside the Kissflow platform."
      );
    }
      console.info("Outside initialize if");
    return this._postMessageAsync(
      LISTENER_CMDS.CC_INITIALIZE,
      {},
      true,
      (data) => {
        this.app = new Application(data, true);
        this.page = new Page(data, true);
        this.context = new CustomComponent(data.componentId);
        this.client = new Client();
        this.formatter = new Formatter();
        this.user = data.user;
        this.account = data.account;
        this.env = data.envDetails;
        return this;
      }
    );
  }
  initialise() {
    return this.initialize();
  }
}
var index = new CustomComponentSDK();
export { index as default };`;
