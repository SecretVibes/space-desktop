import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import PieChart from '@terminal-packages/space-ui/core/PieChart';
import { getCurrentUsage } from '@events';
import { formatBytes } from '@utils';
import useStyles from './styles';
import { BaseCard } from '../../../../components';
import Header from '../Header';

const CurrentUsage = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const state = useSelector((s) => s.settings.usage.current);

  useEffect(() => {
    getCurrentUsage();
  }, []);

  const { storage = 0, bandwidth = 0 } = state.data;
  const bandwidthFormatted = formatBytes(bandwidth, 0);
  const storageFormatted = formatBytes(storage, 0);
  const togetherFormatted = formatBytes(storage + bandwidth, 0);
  const [togetherValue] = togetherFormatted.match(/^\d+/); // all digits from start
  const [togetherUnit] = togetherFormatted.match(/[^\d]+$/); // all non digits at the end

  return (
    <BaseCard className={classes.panel}>
      <Header
        title={t('modals.settings.usage.currentUsage.title')}
        subtitle="(10/01/20 - 10/30/20)"
        tooltip={t('modals.settings.usage.currentUsage.tooltip')}
        usedMemory="800"
        totalMemory="1"
        withTooltip
      />
      <div className={classes.pieChartWrapper}>
        <PieChart
          data={[
            { label: t('modals.settings.usage.currentUsage.labels.bandwidth', { size: bandwidthFormatted }), value: bandwidth, color: '#59F66E' },
            { label: t('modals.settings.usage.currentUsage.labels.storage', { size: storageFormatted }), value: storage, color: '#0063FF' },
          ]}
          mainLabel={[togetherValue, togetherUnit]}
        />
      </div>
    </BaseCard>
  );
};

export default CurrentUsage;
