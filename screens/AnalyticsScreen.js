import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { COLORS } from '../constants/colors';

const { width } = Dimensions.get('window');

export default function AnalyticsScreen() {
  const [analyticsData, setAnalyticsData] = useState({
    ph: { current: 7.2, avg: 7.1, min: 6.8, max: 7.5, trend: 'stable', unit: '' },
    turbidity: { current: 2.5, avg: 2.3, min: 1.8, max: 3.2, trend: 'increasing', unit: 'NTU' },
    dissolvedOxygen: { current: 8.4, avg: 8.6, min: 7.9, max: 9.1, trend: 'stable', unit: 'mg/L' },
    tds: { current: 450, avg: 420, min: 380, max: 480, trend: 'increasing', unit: 'ppm' },
    conductivity: { current: 680, avg: 650, min: 620, max: 720, trend: 'stable', unit: 'µS/cm' },
    temperature: { current: 28.5, avg: 27.8, min: 26.5, max: 29.8, trend: 'increasing', unit: '°C' },
  });

  const [history, setHistory] = useState({
    ph: [7.0, 7.2, 6.8, 7.1, 7.3, 6.9, 7.5],
    turbidity: [2.0, 2.4, 2.1, 2.5, 2.6, 2.2, 2.5],
    dissolvedOxygen: [8.0, 8.3, 8.1, 8.5, 8.6, 8.4, 8.4],
    tds: [410, 420, 435, 440, 450, 455, 450],
    conductivity: [640, 655, 660, 670, 680, 675, 680],
    temperature: [27.2, 27.6, 28.0, 28.4, 28.6, 28.3, 28.5],
  });

  const chartWidth = width - 64;
  const chartHeight = 180;

  const sensorRange = {
    ph: { min: 5.5, max: 9.5 },
    turbidity: { min: 0, max: 10 },
    dissolvedOxygen: { min: 5, max: 12 },
    tds: { min: 300, max: 500 },
    conductivity: { min: 600, max: 760 },
    temperature: { min: 25, max: 31 },
  };

  const normalizePoint = (value, range) => {
    const fullRange = range.max - range.min;
    return ((value - range.min) / fullRange) * chartHeight;
  };

  const chartPoints = history.ph.map((value, index) => ({
    x: (chartWidth / (history.ph.length - 1)) * index,
    y: chartHeight - normalizePoint(value, sensorRange.ph),
    value,
  }));

  const getChartPoints = (historyData, range) => 
    historyData.map((value, index) => ({
      x: (chartWidth / (historyData.length - 1)) * index,
      y: chartHeight - normalizePoint(value, range),
      value,
    }));

  const getLineStyle = (start, end) => {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    return {
      left: start.x,
      top: start.y,
      width: length,
      transform: [{ rotate: `${angle}deg` }],
    };
  };

  const getHistoryPoints = (data, range) => data.map((value, index) => ({
    x: (80 / (data.length - 1)) * index,
    y: 60 - normalizePoint(value, range) * (60 / chartHeight),
  }));

  const renderSparkline = (key, values, range) => {
    const points = getHistoryPoints(values, range);
    return (
      <View style={styles.sparklineContainer}>
        {points.map((point, index) => index < points.length - 1 && (
          <View key={`line-${key}-${index}`} style={[styles.sparklineLine, getLineStyle(point, points[index + 1])]} />
        ))}
        {points.map((point, index) => (
          <View key={`dot-${key}-${index}`} style={[styles.sparklineDot, { left: point.x - 3, top: point.y - 3 }]} />
        ))}
      </View>
    );
  };

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAnalyticsData(prev => {
        const nextPh = parseFloat((prev.ph.current + (Math.random() - 0.5) * 0.1).toFixed(2));
        const nextTurbidity = parseFloat((prev.turbidity.current + (Math.random() - 0.5) * 0.2).toFixed(1));
        const nextDissolvedOxygen = parseFloat((prev.dissolvedOxygen.current + (Math.random() - 0.5) * 0.1).toFixed(1));
        const nextTds = Math.max(300, Math.min(500, Math.floor(prev.tds.current + (Math.random() - 0.5) * 10)));
        const nextConductivity = Math.max(600, Math.min(760, Math.floor(prev.conductivity.current + (Math.random() - 0.5) * 15)));
        const nextTemperature = parseFloat((prev.temperature.current + (Math.random() - 0.5) * 0.3).toFixed(1));

        setHistory(prevHistory => ({
          ph: [...prevHistory.ph.slice(1), nextPh],
          turbidity: [...prevHistory.turbidity.slice(1), nextTurbidity],
          dissolvedOxygen: [...prevHistory.dissolvedOxygen.slice(1), nextDissolvedOxygen],
          tds: [...prevHistory.tds.slice(1), nextTds],
          conductivity: [...prevHistory.conductivity.slice(1), nextConductivity],
          temperature: [...prevHistory.temperature.slice(1), nextTemperature],
        }));

        return {
          ...prev,
          ph: { ...prev.ph, current: nextPh, trend: nextPh > prev.ph.current ? 'increasing' : nextPh < prev.ph.current ? 'decreasing' : prev.ph.trend, avg: parseFloat(((prev.ph.avg * 6 + nextPh) / 7).toFixed(2)), min: Math.min(prev.ph.min, nextPh), max: Math.max(prev.ph.max, nextPh) },
          turbidity: { ...prev.turbidity, current: nextTurbidity, trend: nextTurbidity > prev.turbidity.current ? 'increasing' : nextTurbidity < prev.turbidity.current ? 'decreasing' : prev.turbidity.trend, avg: parseFloat(((prev.turbidity.avg * 6 + nextTurbidity) / 7).toFixed(1)), min: Math.min(prev.turbidity.min, nextTurbidity), max: Math.max(prev.turbidity.max, nextTurbidity) },
          dissolvedOxygen: { ...prev.dissolvedOxygen, current: nextDissolvedOxygen, trend: nextDissolvedOxygen > prev.dissolvedOxygen.current ? 'increasing' : nextDissolvedOxygen < prev.dissolvedOxygen.current ? 'decreasing' : prev.dissolvedOxygen.trend, avg: parseFloat(((prev.dissolvedOxygen.avg * 6 + nextDissolvedOxygen) / 7).toFixed(1)), min: Math.min(prev.dissolvedOxygen.min, nextDissolvedOxygen), max: Math.max(prev.dissolvedOxygen.max, nextDissolvedOxygen) },
          tds: { ...prev.tds, current: nextTds, trend: nextTds > prev.tds.current ? 'increasing' : nextTds < prev.tds.current ? 'decreasing' : prev.tds.trend, avg: Math.round((prev.tds.avg * 6 + nextTds) / 7), min: Math.min(prev.tds.min, nextTds), max: Math.max(prev.tds.max, nextTds) },
          conductivity: { ...prev.conductivity, current: nextConductivity, trend: nextConductivity > prev.conductivity.current ? 'increasing' : nextConductivity < prev.conductivity.current ? 'decreasing' : prev.conductivity.trend, avg: Math.round((prev.conductivity.avg * 6 + nextConductivity) / 7), min: Math.min(prev.conductivity.min, nextConductivity), max: Math.max(prev.conductivity.max, nextConductivity) },
          temperature: { ...prev.temperature, current: nextTemperature, trend: nextTemperature > prev.temperature.current ? 'increasing' : nextTemperature < prev.temperature.current ? 'decreasing' : prev.temperature.trend, avg: parseFloat(((prev.temperature.avg * 6 + nextTemperature) / 7).toFixed(1)), min: Math.min(prev.temperature.min, nextTemperature), max: Math.max(prev.temperature.max, nextTemperature) },
        };
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'increasing': return COLORS.warning;
      case 'decreasing': return COLORS.normal;
      default: return COLORS.textMuted;
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'increasing': return '↗️';
      case 'decreasing': return '↘️';
      default: return '→';
    }
  };

  const renderMetricCard = (key, data, label, unit) => {
    const sensorChartPoints = getChartPoints(history[key], sensorRange[key]);
    return (
      <View key={key} style={styles.metricCard}>
        <View style={styles.metricHeader}>
          <View>
            <Text style={styles.metricTitle}>{label}</Text>
            <Text style={styles.metricSubtitle}>Trend over time</Text>
          </View>
          <Text style={[styles.trendIcon, { color: getTrendColor(data.trend) }]}>
            {getTrendIcon(data.trend)}
          </Text>
        </View>

        <View style={styles.chartFrame}>
          <View style={styles.axisYLabels}>
            {[sensorRange[key].max, (sensorRange[key].max + sensorRange[key].min) / 2, sensorRange[key].min].map((label, index) => (
              <Text key={index} style={styles.axisYLabel}>{typeof label === 'number' ? label.toFixed(1) : label}</Text>
            ))}
          </View>
          <View style={styles.chartContent}>
            <View style={styles.gridLines}>
              {[0, 1, 2].map(line => (
                <View key={line} style={[styles.gridLine, { top: (chartHeight / 2) * line }]} />
              ))}
            </View>

            <View style={[styles.chartPlot, { width: chartWidth, height: chartHeight }]}>
              {sensorChartPoints.map((point, index) => index < sensorChartPoints.length - 1 && (
                <View
                  key={`line-${key}-${index}`}
                  style={[styles.lineSegment, getLineStyle(point, sensorChartPoints[index + 1])]}
                />
              ))}

              {sensorChartPoints.map((point, index) => (
                <View
                  key={`dot-${key}-${index}`}
                  style={[styles.chartDot, { left: point.x - 6, top: point.y - 6 }]}
                />
              ))}
            </View>
          </View>
        </View>

        <View style={styles.axisLabels}>
          {['06:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00'].map((label, index) => (
            <Text key={label} style={styles.axisLabel}>{label}</Text>
          ))}
        </View>

        <View style={styles.metricStatsRow}>
          <View style={styles.metricStatBlock}>
            <Text style={styles.metricStatLabel}>Current</Text>
            <Text style={styles.metricStatValue}>{data.current}{unit}</Text>
          </View>
          <View style={styles.metricStatBlock}>
            <Text style={styles.metricStatLabel}>Avg</Text>
            <Text style={styles.metricStatValue}>{data.avg}</Text>
          </View>
          <View style={styles.metricStatBlock}>
            <Text style={styles.metricStatLabel}>Range</Text>
            <Text style={styles.metricStatValue}>{data.min} - {data.max}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Analytics</Text>
        <Text style={styles.headerSubtitle}>Live Data Analysis</Text>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <View>
              <Text style={styles.chartTitle}>Water Quality Monitoring System</Text>
              <Text style={styles.chartSubtitle}>pH trend over time</Text>
            </View>
            <View style={styles.tagBox}>
              <Text style={styles.tagText}>Live</Text>
            </View>
          </View>

          <View style={styles.chartFrame}>
            <View style={styles.axisYLabels}>
              {[sensorRange.ph.max, 8.5, 7.5, 6.5, sensorRange.ph.min].map((label, index) => (
                <Text key={index} style={styles.axisYLabel}>{label}</Text>
              ))}
            </View>
            <View style={styles.chartContent}>
              <View style={styles.gridLines}>
                {[0, 1, 2, 3, 4].map(line => (
                  <View key={line} style={[styles.gridLine, { top: (chartHeight / 4) * line }]} />
                ))}
              </View>

              <View style={[styles.chartPlot, { width: chartWidth, height: chartHeight }]}> 
                {chartPoints.map((point, index) => index < chartPoints.length - 1 && (
                  <View
                    key={`line-${index}`}
                    style={[styles.lineSegment, getLineStyle(point, chartPoints[index + 1])]}
                  />
                ))}

                {chartPoints.map((point, index) => (
                  <View
                    key={`dot-${index}`}
                    style={[styles.chartDot, { left: point.x - 6, top: point.y - 6 }]}
                  />
                ))}
              </View>
            </View>
          </View>

          <View style={styles.axisLabels}>
            {['06:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00'].map((label, index) => (
              <Text key={label} style={styles.axisLabel}>{label}</Text>
            ))}
          </View>

          <View style={styles.chartStatsRow}>
            <View style={styles.chartStatBlock}>
              <Text style={styles.chartStatLabel}>Current</Text>
              <Text style={styles.chartStatValue}>{analyticsData.ph.current}</Text>
            </View>
            <View style={styles.chartStatBlock}>
              <Text style={styles.chartStatLabel}>Avg</Text>
              <Text style={styles.chartStatValue}>{analyticsData.ph.avg}</Text>
            </View>
            <View style={styles.chartStatBlock}>
              <Text style={styles.chartStatLabel}>Range</Text>
              <Text style={styles.chartStatValue}>{analyticsData.ph.min} - {analyticsData.ph.max}</Text>
            </View>
          </View>
        </View>

        {/* Metrics Grid */}
        <View style={styles.metricsGrid}>
          {renderMetricCard('turbidity', analyticsData.turbidity, 'Turbidity', ' NTU')}
          {renderMetricCard('dissolvedOxygen', analyticsData.dissolvedOxygen, 'Dissolved Oxygen', ' mg/L')}
          {renderMetricCard('tds', analyticsData.tds, 'TDS', ' ppm')}
          {renderMetricCard('conductivity', analyticsData.conductivity, 'Conductivity', ' µS/cm')}
          {renderMetricCard('temperature', analyticsData.temperature, 'Temperature', ' °C')}
        </View>

        {/* Last Update */}
        <View style={styles.updateCard}>
          <Text style={styles.updateTitle}>Last Update</Text>
          <Text style={styles.updateTime}>Just now</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.white,
  },
  headerSubtitle: {
    fontSize: 13,
    color: COLORS.textInfo,
    marginTop: 4,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 80,
  },
  summaryCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderTopWidth: 3,
    borderTopColor: COLORS.primary,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  metricsGrid: {
    marginBottom: 24,
  },
  metricCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderTopWidth: 3,
    borderTopColor: COLORS.primary,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  metricTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  metricSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  trendIcon: {
    fontSize: 18,
    fontWeight: '700',
  },
  metricStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  metricStatBlock: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 14,
    marginRight: 8,
  },
  metricStatLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  metricStatValue: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  chartCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderTopWidth: 3,
    borderTopColor: COLORS.primary,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  chartSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  tagBox: {
    backgroundColor: COLORS.primarySurface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  tagText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 12,
  },
  chartFrame: {
    flexDirection: 'row',
    marginBottom: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.background,
    borderRadius: 16,
    overflow: 'hidden',
  },
  axisYLabels: {
    width: 40,
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingLeft: 12,
  },
  axisYLabel: {
    color: COLORS.textMuted,
    fontSize: 11,
  },
  chartContent: {
    flex: 1,
  },
  gridLines: {
    ...StyleSheet.absoluteFillObject,
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: COLORS.border,
  },
  chartPlot: {
    position: 'relative',
    marginHorizontal: 16,
  },
  lineSegment: {
    position: 'absolute',
    height: 2,
    backgroundColor: COLORS.primary,
    borderRadius: 1,
  },
  chartDot: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 999,
    backgroundColor: COLORS.primary,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  axisLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  axisLabel: {
    color: COLORS.textMuted,
    fontSize: 11,
  },
  chartStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  chartStatBlock: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 14,
    marginRight: 8,
  },
  chartStatLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  chartStatValue: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  chartStatBlockLast: {
    marginRight: 0,
  },
  sparklineContainer: {
    position: 'relative',
    width: 80,
    height: 60,
    marginBottom: 12,
    backgroundColor: COLORS.background,
    borderRadius: 12,
    overflow: 'hidden',
  },
  sparklineLine: {
    position: 'absolute',
    height: 2,
    backgroundColor: COLORS.primary,
    borderRadius: 1,
  },
  sparklineDot: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 999,
    backgroundColor: COLORS.primary,
    borderWidth: 1,
    borderColor: COLORS.white,
  },
  sparklineRow: {
    marginBottom: 12,
  },
  updateCard: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  updateTitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: '600',
  },
  updateTime: {
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: '600',
    marginTop: 4,
  },
});
