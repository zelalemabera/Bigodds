import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';

const AddMatchForm = () => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const navigation = useNavigation();

    const [formData, setFormData] = useState({
        homeTeam: '',
        awayTeam: '',
        homeScore: '',
        awayScore: '',
        league: '',
        matchTime: '',
        homePossession: '50',
        awayPossession: '50',
        status: 'FT',
        isLive: false,
        Tips: '',
        odds: ''
    });

    const theme = {
        background: isDark ? '#1A1A1A' : '#F8FAFC',
        card: isDark ? '#2A2A2A' : '#FFFFFF',
        text: isDark ? '#E2E8F0' : '#1E293B',
        secondaryText: isDark ? '#94A3B8' : '#64748B',
        accent: isDark ? '#6366F1' : '#4F46E5',
        accentSecondary: isDark ? '#EF4444' : '#DC2626',
        border: isDark ? '#404040' : '#E2E8F0',
        inputBackground: isDark ? '#333333' : '#F8FAFC',
        shadow: isDark ? '#000000' : '#94A3B8'
    };

    const handleSubmit = async () => {
        console.log('Match data:', formData);//just checking if data is bieng registered in formdat obj....
        try {
            const response = await fetch('http://localhost:80/Big-Odds/api/BigOdds.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            // const data = await response.json();
            navigation.goBack();
        } catch (error) {
            console.error('Fetch Error:', error);
        }
    };

    const updatePossession = (team, value) => {
        const numValue = parseInt(value) || 0;
        if (team === 'home') {
            setFormData(prev => ({
                ...prev,
                homePossession: Math.min(100, Math.max(0, numValue)).toString(),
                awayPossession: Math.min(100, Math.max(0, 100 - numValue)).toString()
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                awayPossession: Math.min(100, Math.max(0, numValue)).toString(),
                homePossession: Math.min(100, Math.max(0, 100 - numValue)).toString()
            }));
        }
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={[styles.formCard, { backgroundColor: theme.card, shadowColor: theme.shadow }]}>
                {/* Header */}
                <View style={[styles.header, { borderBottomColor: theme.border }]}>
                    <Text style={[styles.title, { color: theme.text }]}>Add New Match</Text>
                    <Text style={[styles.subtitle, { color: theme.secondaryText }]}>Fill in the match details</Text>
                </View>

                {/* League & Time */}
                <View style={styles.row}>
                    <View style={[styles.inputContainer, { flex: 1 }]}>
                        <Text style={[styles.label, { color: theme.text }]}>League</Text>
                        <TextInput
                            style={[styles.input, {
                                backgroundColor: theme.inputBackground,
                                color: theme.text,
                                borderColor: theme.border
                            }]}
                            placeholder="e.g., TURKEY SUPER LEAGUE"
                            placeholderTextColor={theme.secondaryText}
                            value={formData.league}
                            onChangeText={(text) => setFormData(prev => ({ ...prev, league: text }))}
                        />
                    </View>

                    <View style={[styles.inputContainer, { width: 120 }]}>
                        <Text style={[styles.label, { color: theme.text }]}>Match Time</Text>
                        <TextInput
                            style={[styles.input, {
                                backgroundColor: theme.inputBackground,
                                color: theme.text,
                                borderColor: theme.border
                            }]}
                            placeholder="23:00"
                            placeholderTextColor={theme.secondaryText}
                            value={formData.matchTime}
                            onChangeText={(text) => setFormData(prev => ({ ...prev, matchTime: text }))}
                            keyboardType="default"
                        />
                    </View>
                </View>

                {/* Teams Section */}
                <View style={styles.teamsContainer}>
                    {/* Home Team */}
                    <View style={styles.teamSection}>
                        <View style={[styles.logoPlaceholder, { backgroundColor: theme.accent }]}>
                            <Text style={styles.logoText}>H</Text>
                        </View>
                        <TextInput
                            style={[styles.teamInput, {
                                backgroundColor: theme.inputBackground,
                                color: theme.text,
                                borderColor: theme.border
                            }]}
                            placeholder="Home Team"
                            placeholderTextColor={theme.secondaryText}
                            value={formData.homeTeam}
                            onChangeText={(text) => setFormData(prev => ({ ...prev, homeTeam: text }))}
                        />
                    </View>

                    {/* VS Separator */}
                    <View style={styles.vsContainer}>
                        <Text style={[styles.vsText, { color: theme.secondaryText }]}>VS</Text>
                    </View>

                    {/* Away Team */}
                    <View style={styles.teamSection}>
                        <View style={[styles.logoPlaceholder, { backgroundColor: theme.accentSecondary }]}>
                            <Text style={styles.logoText}>A</Text>
                        </View>
                        <TextInput
                            style={[styles.teamInput, {
                                backgroundColor: theme.inputBackground,
                                color: theme.text,
                                borderColor: theme.border
                            }]}
                            placeholder="Away Team"
                            placeholderTextColor={theme.secondaryText}
                            value={formData.awayTeam}
                            onChangeText={(text) => setFormData(prev => ({ ...prev, awayTeam: text }))}
                        />
                    </View>
                </View>

                {/* Tips & Odds */}
                <View style={styles.row}>
                    <View style={[styles.inputContainer, { flex: 1, width: 120 }]}>
                        <Text style={[styles.label, { color: theme.text }]}>Tips</Text>
                        <TextInput
                            style={[styles.input, {
                                backgroundColor: theme.inputBackground,
                                color: theme.text,
                                borderColor: theme.border
                            }]}
                            placeholder="Both Teams Score"
                            placeholderTextColor={theme.secondaryText}
                            value={formData.Tips}
                            onChangeText={(text) => setFormData(prev => ({ ...prev, Tips: text }))}
                        />
                    </View>

                    <View style={[styles.inputContainer, { width: 120 }]}>
                        <Text style={[styles.label, { color: theme.text }]}>Odds</Text>
                        <TextInput
                            style={[styles.input, {
                                backgroundColor: theme.inputBackground,
                                color: theme.text,
                                borderColor: theme.border
                            }]}
                            placeholder="1.5"
                            placeholderTextColor={theme.secondaryText}
                            value={formData.odds}
                            onChangeText={(text) => setFormData(prev => ({ ...prev, odds: text }))}
                        />
                    </View>
                </View>

                {/* Scores */}
                <View style={styles.scoresContainer}>
                    <Text style={[styles.label, { color: theme.text }]}>Scores</Text>
                    <View style={styles.scoresRow}>
                        <TextInput
                            style={[styles.scoreInput, {
                                backgroundColor: theme.inputBackground,
                                color: theme.text,
                                borderColor: theme.border
                            }]}
                            placeholder="2"
                            keyboardType="numeric"
                            value={formData.homeScore}
                            onChangeText={(text) => setFormData(prev => ({ ...prev, homeScore: text }))}
                        />
                        <Text style={[styles.colon, { color: theme.secondaryText }]}>:</Text>
                        <TextInput
                            style={[styles.scoreInput, {
                                backgroundColor: theme.inputBackground,
                                color: theme.text,
                                borderColor: theme.border
                            }]}
                            placeholder="1"
                            keyboardType="numeric"
                            value={formData.awayScore}
                            onChangeText={(text) => setFormData(prev => ({ ...prev, awayScore: text }))}
                        />
                    </View>
                </View>

                {/* Possession */}
                <View style={styles.possessionContainer}>
                    <Text style={[styles.label, { color: theme.text }]}>Possession %</Text>
                    <View style={styles.possessionRow}>
                        <View style={styles.teamPossession}>
                            <Text style={[styles.teamLabel, { color: theme.text }]}>Home</Text>
                            <TextInput
                                style={[styles.possessionInput, {
                                    backgroundColor: theme.inputBackground,
                                    color: theme.text,
                                    borderColor: theme.border
                                }]}
                                value={formData.homePossession}
                                keyboardType="numeric"
                                onChangeText={(value) => updatePossession('home', value)}
                            />
                            <Text style={[styles.percentage, { color: theme.secondaryText }]}>%</Text>
                        </View>

                        <View style={styles.possessionBarContainer}>
                            <View style={styles.possessionBarBackground}>
                                <View style={[styles.possessionBarFill, {
                                    width: `${formData.homePossession}%`,
                                    backgroundColor: theme.accent
                                }]} />
                            </View>
                        </View>

                        <View style={styles.teamPossession}>
                            <Text style={[styles.teamLabel, { color: theme.text }]}>Away</Text>
                            <TextInput
                                style={[styles.possessionInput, {
                                    backgroundColor: theme.inputBackground,
                                    color: theme.text,
                                    borderColor: theme.border
                                }]}
                                value={formData.awayPossession}
                                keyboardType="numeric"
                                onChangeText={(value) => updatePossession('away', value)}
                            />
                            <Text style={[styles.percentage, { color: theme.secondaryText }]}>%</Text>
                        </View>
                    </View>
                </View>

                {/* Status & Live Toggle */}
                <View style={styles.statusContainer}>
                    <View style={styles.statusRow}>
                        <Text style={[styles.label, { color: theme.text }]}>Match Status</Text>
                        <View style={styles.switchContainer}>
                            <Text style={[styles.switchLabel, { color: theme.secondaryText }]}>
                                {formData.isLive ? 'Live' : 'Finished'}
                            </Text>
                            <Switch
                                value={formData.isLive}
                                onValueChange={(value) => setFormData(prev => ({ ...prev, isLive: value }))}
                                thumbColor={formData.isLive ? theme.accent : '#f4f3f4'}
                                trackColor={{ false: '#767577', true: theme.accent + '80' }}
                            />
                        </View>
                    </View>


                    {!formData.isLive && (
                        <TextInput
                            style={[styles.statusInput, {
                                backgroundColor: theme.inputBackground,
                                color: theme.text,
                                borderColor: theme.border
                            }]}
                            placeholder="FT"
                            value={formData.status}
                            onChangeText={(text) => setFormData(prev => ({ ...prev, status: text }))}
                        />
                    )}
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                    style={[styles.submitButton, { backgroundColor: theme.accent }]}
                    onPress={handleSubmit}
                >
                    <Text style={styles.submitButtonText}>Add Match</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    formCard: {
        borderRadius: 0,
        padding: 24,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 8,
        borderWidth: 1,
        borderColor: 'rgba(32, 8, 8, 0.29)',
    },
    header: {
        borderBottomWidth: 1,
        paddingBottom: 20,
        marginBottom: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        fontWeight: '500',
    },
    TipsandOdds: {
        display: 'flex',
        borderColor: '#ffff',
        flexDirection: 'row',
        gap: 16,
        marginBottom: 24,
    },
    row: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 24,
    },
    inputContainer: {
        marginBottom: 16,
    },
    label: {
        fontSize: 12,
        fontWeight: '700',
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    input: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 14,
        fontSize: 14,
        fontWeight: '500',
    },
    teamsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
        marginTop: 2,
    },
    teamSection: {
        alignItems: 'center',
        flex: 1,
    },
    logoPlaceholder: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 4,
    },
    logoText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '900',
    },
    teamInput: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 12,
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
        width: '100%',
    },
    vsContainer: {
        paddingHorizontal: 16,
    },
    vsText: {
        fontSize: 16,
        fontWeight: '800',
    },
    scoresContainer: {
        marginBottom: 24,
        marginTop: 15,
    },
    scoresRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
    },
    scoreInput: {
        borderWidth: 1,
        borderRadius: 16,
        padding: 16,
        fontSize: 24,
        fontWeight: '800',
        textAlign: 'center',
        width: 80,
    },
    colon: {
        fontSize: 20,
        fontWeight: '800',
    },
    possessionContainer: {
        marginBottom: 24,
    },
    possessionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
    },
    teamPossession: {
        alignItems: 'center',
        minWidth: 60,
    },
    teamLabel: {
        fontSize: 11,
        fontWeight: '700',
        marginBottom: 4,
        textTransform: 'uppercase',
    },
    possessionInput: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 8,
        fontSize: 14,
        fontWeight: '700',
        textAlign: 'center',
        width: 50,
    },
    percentage: {
        fontSize: 10,
        fontWeight: '600',
        marginTop: 2,
    },
    possessionBarContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    possessionBarBackground: {
        height: 6,
        backgroundColor: '#E2E8F0',
        borderRadius: 3,
        overflow: 'hidden',
    },
    possessionBarFill: {
        height: '100%',
        borderRadius: 3,
    },
    statusContainer: {
        marginBottom: 32,
    },
    statusRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    switchLabel: {
        fontSize: 12,
        fontWeight: '600',
    },
    statusInput: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        fontSize: 12,
        fontWeight: '700',
        textAlign: 'center',
        width: 60,
        alignSelf: 'center',
    },
    submitButton: {
        padding: 18,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
});

export default AddMatchForm;