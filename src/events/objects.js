import get from 'lodash/get';
import { ipcRenderer } from 'electron';
import { objectPresenter } from '@utils';
import {
  STORE_DIR,
  STORE_OBJECTS,
  SET_ERROR_STATE,
  SET_LOADING_STATE,
} from '@reducers/storage';

import store from '../store';

const EVENT_PREFIX = 'objects';
const OPEN_EVENT = `${EVENT_PREFIX}:open`;
const FETCH_EVENT = `${EVENT_PREFIX}:fetch`;
const ERROR_EVENT = `${EVENT_PREFIX}:error`;
const SUCCESS_EVENT = `${EVENT_PREFIX}:success`;
const FETCH_DIR_EVENT = `${EVENT_PREFIX}:fetchDir`;
const SUCCESS_DIR_EVENT = `${EVENT_PREFIX}:successDir`;
const FETCH_SHARED_OBJECTS_EVENT = `${EVENT_PREFIX}:fetchShared`;
const FETCH_SHARED_OBJECTS_ERROR_EVENT = `${EVENT_PREFIX}:fetchShared:error`;
const FETCH_SHARED_OBJECTS_SUCCESS_EVENT = `${EVENT_PREFIX}:fetchShared:success`;

const registerObjectsEvents = () => {
  ipcRenderer.on(SUCCESS_EVENT, (event, payload) => {
    const entries = get(payload, 'entries', []) || [];
    const objects = entries.map((obj) => objectPresenter(obj));

    store.dispatch({
      payload: objects,
      type: STORE_OBJECTS,
    });
  });

  ipcRenderer.on(SUCCESS_DIR_EVENT, (event, payload) => {
    const entries = get(payload, 'entries', []) || [];
    const objects = entries.map((obj) => objectPresenter(obj));

    store.dispatch({
      payload: objects,
      type: STORE_DIR,
    });
  });

  ipcRenderer.on(ERROR_EVENT, (event, payload) => {
    store.dispatch({
      payload,
      type: SET_ERROR_STATE,
    });
  });

  ipcRenderer.on(FETCH_SHARED_OBJECTS_SUCCESS_EVENT, (event, payload) => {
    const entries = get(payload, 'items', []) || [];
    const objects = entries.map((obj) => objectPresenter(obj));

    store.dispatch({
      payload: objects,
      type: STORE_DIR,
    });
  });

  ipcRenderer.on(FETCH_SHARED_OBJECTS_ERROR_EVENT, (event, payload) => {
    store.dispatch({
      payload,
      type: SET_ERROR_STATE,
    });
  });
};

export const fetchSharedObjects = (seek = '', limit = 100) => {
  store.dispatch({
    payload: true,
    type: SET_LOADING_STATE,
  });

  ipcRenderer.send(FETCH_SHARED_OBJECTS_EVENT, { seek, limit });
};

export const fetchObjects = (bucket = 'personal') => {
  store.dispatch({
    payload: true,
    type: SET_LOADING_STATE,
  });

  ipcRenderer.send(FETCH_EVENT, { bucket });
};

export const fetchDir = (path = '', bucket = 'personal', fetchSubFolders = true) => {
  store.dispatch({
    payload: true,
    type: SET_LOADING_STATE,
  });

  ipcRenderer.send(FETCH_DIR_EVENT, { path, bucket, fetchSubFolders });
};

export const openObject = (path, dbId, bucket = 'personal') => ipcRenderer.send(OPEN_EVENT, {
  path,
  bucket,
  ...(dbId && { dbId }),
});

export default registerObjectsEvents;
