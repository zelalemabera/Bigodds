import useColorTheme from '@/hooks/UseColorTheme';
import { StyleSheet, Text, View } from 'react-native';

const SoccerMatchPredictions = ({
    League = 'Premier League',
    matchTime = '20:00',
    HomeTeam = 'Team A',
    AwayTeam = 'Team B',
    HomeTeamScore = 1,
    AwayTeamScore = 2,
    HomePossesion = 55,
    AwayPossesion = 45,
    status = 'FT',
    Tip = 'Over 2.5 Goals',
    odds = '1.85'
}) => {
    const colorScheme = useColorTheme();
    const isDark = colorScheme === 'dark';

    const theme = {
        background: isDark ? 'linear-gradient(145deg, #2D2D2D, #1A1A1A)' : 'linear-gradient(145deg, #FFFFFF, #F1F5F9)',
        cardBackground: isDark ? '#2A2A2A' : '#FFFFFF',
        text: isDark ? '#E2E8F0' : '#1E293B',
        border: isDark ? '#404040' : '#E2E8F0',
        secondaryText: isDark ? '#94A3B8' : '#64748B',
        accent: isDark ? '#6366F1' : '#4F46E5',
        accentSecondary: isDark ? '#EF4444' : '#DC2626',
        shadow: isDark ? '#000000' : '#94A3B8',
        glow: isDark ? '#6366F1' : '#818CF8'
    };

    function getFirstLetterCapital(str) {
        if (!str) return '';
        return str.charAt(0).toUpperCase();
    }

    return (
        <View style={[styles.container, {
            backgroundColor: isDark ? '#2A2A2A' : '#FFFFFF',
            borderColor: theme.border,
            shadowColor: theme.shadow
        }]}>
            <View style={[styles.backgroundGradient, {
                backgroundColor: isDark ? '#2D2D2D' : '#F1F5F9'
            }]} />

            <View style={[styles.header, { borderBottomColor: theme.border }]}>
                <Text style={[styles.leagueText, { color: theme.text }]}>{League}</Text>
                <View style={[styles.timeIndicator, {
                    backgroundColor: isDark ? '#3B3B3B' : '#F8FAFC',
                    borderColor: isDark ? '#4A4A4A' : '#E2E8F0'
                }]}>
                    <Text style={[styles.timeText, { color: theme.secondaryText }]}>{matchTime}</Text>
                </View>
            </View>

            <View style={styles.matchContainer}>
                <View style={styles.teamSection}>
                    <View style={[styles.logoContainer, {
                        shadowColor: theme.glow
                    }]}>
                        <View style={[styles.logo, styles.homeLogo, {
                            backgroundColor: theme.accent,
                            borderColor: isDark ? '#818CF8' : '#6366F1'
                        }]}>
                            <Text style={styles.logoText}>{getFirstLetterCapital(HomeTeam)}</Text>
                            <View style={[styles.logoShine, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.3)' }]} />
                        </View>
                    </View>
                    <Text style={[styles.teamName, { color: theme.text }]}>{HomeTeam}</Text>
                    <View style={styles.possessionContainer}>
                        <View style={[styles.possessionBar, { width: `${HomePossesion}%`, backgroundColor: theme.accent }]} />
                        <Text style={[styles.possession, { color: theme.secondaryText }]}>{HomePossesion + '%'}</Text>
                    </View>
                </View>

                <View style={styles.scoreSection}>
                    <View style={[styles.scoreContainer, {
                        backgroundColor: isDark ? '#333333' : '#F8FAFC',
                        borderColor: isDark ? '#404040' : '#E2E8F0'
                    }]}>
                        <Text style={[styles.score, { color: theme.text }]}>{HomeTeamScore}</Text>
                        <View style={[styles.colonContainer, { backgroundColor: isDark ? '#3B3B3B' : '#F1F5F9' }]}>
                            <Text style={[styles.colon, { color: theme.secondaryText }]}>:</Text>
                        </View>
                        <Text style={[styles.score, { color: theme.text }]}>{AwayTeamScore}</Text>
                    </View>
                    <View style={[styles.status, {
                        backgroundColor: isDark ? '#3B3B3B' : '#F8FAFC',
                        borderColor: isDark ? '#4A4A4A' : '#E2E8F0'
                    }]}>
                        <Text style={[styles.statusText, { color: theme.text }]}>{status}</Text>
                    </View>
                </View>

                <View style={styles.teamSection}>
                    <View style={[styles.logoContainer, {
                        shadowColor: theme.glow
                    }]}>
                        <View style={[styles.logo, styles.awayLogo, {
                            backgroundColor: theme.accentSecondary,
                            borderColor: isDark ? '#F87171' : '#EF4444'
                        }]}>
                            <Text style={styles.logoText}>{getFirstLetterCapital(AwayTeam)}</Text>
                            <View style={[styles.logoShine, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.3)' }]} />
                        </View>
                    </View>
                    <Text style={[styles.teamName, { color: theme.text }]}>{AwayTeam}</Text>
                    <View style={styles.possessionContainer}>
                        <View style={[styles.possessionBar, { width: `${AwayPossesion}%`, backgroundColor: theme.accentSecondary }]} />
                        <Text style={[styles.possession, { color: theme.secondaryText }]}>{AwayPossesion + '%'}</Text>
                    </View>
                </View>
            </View>

            {/* Tips and Odds Section */}
            <View style={styles.tipsOddsContainer}>
                <Text style={styles.tipText}>{Tip}</Text>
                <Text style={styles.oddsText}>{odds}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
        margin: 6,
        marginBottom: 12,
        width: '94%',
        alignSelf: 'center',
        borderRadius: 0,
        borderWidth: 1,
        position: 'relative',
        overflow: 'hidden',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6,
    },
    backgroundGradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.6,
        zIndex: -1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 14,
        paddingBottom: 12,
        borderBottomWidth: 1,
    },
    leagueText: {
        fontSize: 9,
        fontWeight: '800',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    timeIndicator: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    timeText: {
        fontSize: 9,
        fontWeight: '700',
    },
    matchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    teamSection: {
        alignItems: 'center',
        flex: 1,
    },
    logoContainer: {
        marginBottom: 8,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
        elevation: 4,
    },
    logo: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        position: 'relative',
        overflow: 'hidden',
    },
    logoShine: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '30%',
        borderTopLeftRadius: 22,
        borderTopRightRadius: 22,
    },
    logoText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '900',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    teamName: {
        fontSize: 11,
        fontWeight: '700',
        marginBottom: 6,
        textAlign: 'center',
        textTransform: 'uppercase',
        letterSpacing: 0.3,
    },
    possessionContainer: {
        width: '75%',
        alignItems: 'center',
    },
    possessionBar: {
        height: 3,
        borderRadius: 1.5,
        marginBottom: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 1,
        elevation: 1,
    },
    possession: {
        fontSize: 9,
        fontWeight: '600',
    },
    scoreSection: {
        alignItems: 'center',
        minWidth: 0,
    },
    scoreContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
    },
    score: {
        fontSize: 22,
        fontWeight: '900',
        minWidth: 26,
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.1)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 1,
    },
    colonContainer: {
        paddingHorizontal: 1,
        borderRadius: 3,
    },
    colon: {
        fontSize: 18,
        fontWeight: '800',
        marginHorizontal: 4,
    },
    status: {
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 10,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 1,
    },
    statusText: {
        fontSize: 9,
        fontWeight: '800',
        textTransform: 'uppercase',
    },
    tipsOddsContainer: {
        marginTop: 8,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        paddingVertical: 4,
        borderTopWidth: 0.5,
        borderTopColor: '#e2e8f05a',
    },
    tipText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#49e546ff',
        textAlign: 'center',
        width: '100%',
        marginLeft:22
    },
    oddsText: {
        fontSize: 16,
        fontWeight: '900',
        color: '#EF4444',
        backgroundColor: '#E2E8F0',
        padding: 4,
        borderRadius: 0,
    },
});

export default SoccerMatchPredictions;
