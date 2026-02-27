import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop, Circle, Line, Text as SvgText } from 'react-native-svg';

const { width: SW } = Dimensions.get('window');
const CARD_PADDING = 24;
const CHART_PADDING_H = 40; // left axis space
const CHART_PADDING_RIGHT = 16;

type ChartProps = {
    data: number[];
    labels: string[];
    color?: string;
};

export function Chart({ data, labels, color = '#10b981' }: ChartProps) {
    if (!data || data.length === 0) return null;

    const cardWidth = SW - 48; // section padding
    const chartWidth = cardWidth - CARD_PADDING * 2 - CHART_PADDING_H - CHART_PADDING_RIGHT;
    const chartHeight = 140;

    const minVal = Math.max(0, Math.min(...data) - 10);
    const maxVal = Math.min(100, Math.max(...data) + 10);
    const range = maxVal - minVal || 1;

    const points = data.map((v, i) => ({
        x: data.length === 1 ? chartWidth / 2 : (i / (data.length - 1)) * chartWidth,
        y: chartHeight - ((v - minVal) / range) * chartHeight,
        value: v,
    }));

    // Smooth cubic bezier path
    const buildPath = (pts: { x: number; y: number }[]) => {
        if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;
        let d = `M ${pts[0].x} ${pts[0].y}`;
        for (let i = 0; i < pts.length - 1; i++) {
            const cp1x = pts[i].x + (pts[i + 1].x - pts[i].x) * 0.4;
            const cp1y = pts[i].y;
            const cp2x = pts[i].x + (pts[i + 1].x - pts[i].x) * 0.6;
            const cp2y = pts[i + 1].y;
            d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${pts[i + 1].x} ${pts[i + 1].y}`;
        }
        return d;
    };

    const linePath = buildPath(points);
    const areaPath = `${linePath} L ${points[points.length - 1].x} ${chartHeight} L ${points[0].x} ${chartHeight} Z`;

    const latestValue = data[data.length - 1];
    const previousValue = data.length > 1 ? data[data.length - 2] : data[0];
    const delta = latestValue - previousValue;
    const trend = delta > 0 ? 'up' : delta < 0 ? 'down' : 'stable';

    const getHealthLabel = (v: number) => {
        if (v >= 80) return { label: 'Good', color: '#10b981' };
        if (v >= 60) return { label: 'Fair', color: '#f59e0b' };
        return { label: 'Poor', color: '#ef4444' };
    };
    const healthStatus = getHealthLabel(latestValue);

    // Y-axis grid lines at 25%, 50%, 75%, 100% of display range
    const gridLines = [0, 0.25, 0.5, 0.75, 1].map(pct => ({
        y: chartHeight - pct * chartHeight,
        label: Math.round(minVal + pct * range),
    }));

    const gradientId = `grad_${color.replace('#', '')}`;

    return (
        <View style={{
            backgroundColor: '#fff',
            borderRadius: 24,
            padding: CARD_PADDING,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: '#f1f5f9',
            elevation: 2,
        }}>
            {/* Header */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <View>
                    <Text style={{ fontSize: 11, fontWeight: '800', color: '#94a3b8', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>
                        Health History
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6 }}>
                        <Text style={{ fontSize: 32, fontWeight: '900', color: '#1e293b', lineHeight: 36 }}>
                            {latestValue}
                        </Text>
                        <Text style={{ fontSize: 14, fontWeight: '700', color: '#94a3b8', marginBottom: 2 }}>/100</Text>
                    </View>
                </View>

                <View style={{ alignItems: 'flex-end', gap: 6 }}>
                    <View style={{
                        backgroundColor: healthStatus.color + '18',
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                        borderRadius: 12,
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 5,
                    }}>
                        <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: healthStatus.color }} />
                        <Text style={{ fontSize: 12, fontWeight: '800', color: healthStatus.color }}>
                            {healthStatus.label}
                        </Text>
                    </View>
                    {data.length > 1 && (
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 3,
                            backgroundColor: trend === 'up' ? '#dcfce7' : trend === 'down' ? '#fee2e2' : '#f1f5f9',
                            paddingHorizontal: 8,
                            paddingVertical: 4,
                            borderRadius: 10,
                        }}>
                            <Text style={{
                                fontSize: 11,
                                fontWeight: '800',
                                color: trend === 'up' ? '#16a34a' : trend === 'down' ? '#dc2626' : '#64748b',
                            }}>
                                {trend === 'up' ? '▲' : trend === 'down' ? '▼' : '●'} {Math.abs(delta)} pts
                            </Text>
                        </View>
                    )}
                </View>
            </View>

            {/* Chart area */}
            <View style={{ flexDirection: 'row' }}>
                {/* Y-axis labels */}
                <View style={{
                    width: CHART_PADDING_H - 8,
                    height: chartHeight,
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    paddingRight: 6,
                }}>
                    {[...gridLines].reverse().map((g, i) => (
                        <Text key={i} style={{ fontSize: 9, fontWeight: '700', color: '#cbd5e1' }}>
                            {g.label}
                        </Text>
                    ))}
                </View>

                {/* SVG Chart */}
                <View style={{ flex: 1 }}>
                    <Svg width={chartWidth + CHART_PADDING_RIGHT} height={chartHeight}>
                        <Defs>
                            <LinearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                                <Stop offset="0%" stopColor={color} stopOpacity="0.25" />
                                <Stop offset="100%" stopColor={color} stopOpacity="0.02" />
                            </LinearGradient>
                        </Defs>

                        {/* Grid lines */}
                        {gridLines.map((g, i) => (
                            <Line
                                key={i}
                                x1={0} y1={g.y}
                                x2={chartWidth} y2={g.y}
                                stroke="#f1f5f9"
                                strokeWidth={1}
                                strokeDasharray={i === 0 ? '0' : '4,4'}
                            />
                        ))}

                        {/* Area fill */}
                        <Path d={areaPath} fill={`url(#${gradientId})`} />

                        {/* Line */}
                        <Path
                            d={linePath}
                            fill="none"
                            stroke={color}
                            strokeWidth={2.5}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />

                        {/* Data point dots */}
                        {points.map((pt, i) => (
                            <React.Fragment key={i}>
                                <Circle cx={pt.x} cy={pt.y} r={4} fill="#fff" stroke={color} strokeWidth={2} />
                                {i === points.length - 1 && (
                                    <Circle cx={pt.x} cy={pt.y} r={6} fill={color} opacity={0.2} />
                                )}
                            </React.Fragment>
                        ))}
                    </Svg>

                    {/* X-axis labels */}
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: data.length === 1 ? 'center' : 'space-between',
                        marginTop: 8,
                        paddingRight: CHART_PADDING_RIGHT,
                    }}>
                        {labels.map((label, i) => (
                            <Text key={i} style={{
                                fontSize: 9,
                                fontWeight: '700',
                                color: i === labels.length - 1 ? color : '#94a3b8',
                                textAlign: 'center',
                            }}>
                                {label}
                            </Text>
                        ))}
                    </View>
                </View>
            </View>

            {/* Summary row */}
            {data.length > 1 && (
                <View style={{
                    flexDirection: 'row',
                    marginTop: 16,
                    paddingTop: 14,
                    borderTopWidth: 1,
                    borderTopColor: '#f1f5f9',
                    gap: 0,
                }}>
                    {[
                        { label: 'Scans', value: data.length.toString() },
                        { label: 'Average', value: Math.round(data.reduce((a, b) => a + b, 0) / data.length).toString() },
                        { label: 'Peak', value: Math.max(...data).toString() },
                        { label: 'Lowest', value: Math.min(...data).toString() },
                    ].map((stat, i) => (
                        <View key={i} style={{ flex: 1, alignItems: 'center' }}>
                            <Text style={{ fontSize: 16, fontWeight: '900', color: '#1e293b' }}>{stat.value}</Text>
                            <Text style={{ fontSize: 10, fontWeight: '700', color: '#94a3b8', marginTop: 2, textTransform: 'uppercase', letterSpacing: 0.5 }}>{stat.label}</Text>
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
}
