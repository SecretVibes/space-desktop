import React from 'react';
import path from 'path';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

import { addItems } from '@events';
import { objectsSelector } from '@utils';
import { UPDATE_OBJECTS } from '@reducers/storage';
import ObjectsTable from '@shared/components/ObjectsTable';
import { SHARING_MODAL } from '@shared/components/Modal/actions';

import renderLoadingRows from '../../render-loading-rows';
import RenderRow from '../../RenderRow';
import getTableHeads from '../../getTableHeads';

const FileTable = ({
  bucket,
  prefix,
  baseRedirectUrl,
  EmptyState,
  fetchDir,
  disableRowOffset,
}) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [rows, isSharingModalVisible, loading] = useSelector((state) => [
    objectsSelector(
      state,
      bucket,
      prefix,
      '/',
      true,
    ),
    state.modals.some((modal) => modal.type === SHARING_MODAL),
    state.storage.buckets[bucket].loading,
    state.storage,
  ]);

  const handleTableOutsideClick = (target) => {
    // avoid unselecting if user interact with detail panel
    const detailsPanel = document.getElementById('storage-detail-panel');
    const clickedInDetailsPanel = detailsPanel && detailsPanel.contains(target);
    const hasRowSelected = rows.find((row) => row.selected);

    if (isSharingModalVisible || clickedInDetailsPanel || !hasRowSelected) {
      return;
    }

    dispatch({
      type: UPDATE_OBJECTS,
      payload: rows.map((_row) => ({
        ..._row,
        pivote: false,
        selected: false,
      })),
      bucket,
    });
  };

  const onDropzoneDrop = (files, target) => {
    addItems({
      targetPath: target || prefix,
      sourcePaths: files.map((file) => file.path),
    });
  };

  const getRedirectUrl = (row) => path.posix.join(baseRedirectUrl, prefix, row.key);

  return (
    <ObjectsTable
      rows={rows}
      bucket={bucket}
      loading={rows.length <= 0 && loading}
      renderLoadingRows={renderLoadingRows}
      renderRow={RenderRow}
      heads={getTableHeads(t)}
      getRedirectUrl={getRedirectUrl}
      onDropzoneDrop={onDropzoneDrop}
      onOutsideClick={handleTableOutsideClick}
      EmptyState={EmptyState}
      fetchDir={fetchDir}
      disableRowOffset={disableRowOffset}
    />
  );
};

FileTable.defaultProps = {
  baseRedirectUrl: '/storage/files',
  EmptyState: () => null,
  fetchDir: () => null,
  disableRowOffset: false,
};

FileTable.propTypes = {
  bucket: PropTypes.string.isRequired,
  prefix: PropTypes.string.isRequired,
  baseRedirectUrl: PropTypes.string,
  EmptyState: PropTypes.elementType,
  fetchDir: PropTypes.func,
  disableRowOffset: PropTypes.bool,
};

export default FileTable;
