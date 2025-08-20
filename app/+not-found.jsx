import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';

const NotFound = () => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const navigation = useNavigation();

    const theme = {
        background: isDark ? '#1A1A1A' : '#F8FAFC',
        text: isDark ? '#E2E8F0' : '#1E293B',
        secondaryText: isDark ? '#94A3B8' : '#64748B',
        accent: isDark ? '#6366F1' : '#4F46E5',
        card: isDark ? '#2A2A2A' : '#FFFFFF',
        border: isDark ? '#333333' : '#E2E8F0',
        shadow: isDark ? '#000000' : '#94A3B8'
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Animated Background Elements */}
            <View style={[styles.backgroundOrb, { 
                backgroundColor: isDark ? 'rgba(99, 102, 241, 0.1)' : 'rgba(79, 70, 229, 0.1)',
                top: '20%',
                left: '10%'
            }]} />
            <View style={[styles.backgroundOrb, { 
                backgroundColor: isDark ? 'rgba(239, 68, 68, 0.1)' : 'rgba(220, 38, 38, 0.1)',
                top: '60%',
                right: '15%'
            }]} />
            
            <View style={[styles.content, { backgroundColor: theme.card }]}>
                {/* 3D Illustration Container */}
                <View style={[styles.illustrationContainer, { 
                    shadowColor: theme.shadow,
                    backgroundColor: isDark ? '#2D2D2D' : '#F1F5F9'
                }]}>
                    <Image
                        source={{ uri: 'https://img.freepik.com/free-vector/404-error-with-portals-concept-illustration_114360-7970.jpg?w=826&t=st=1705581232~exp=1705581832~hmac=8d8d1c7e5d5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5' }}
                        style={styles.illustration}
                        resizeMode="contain"
                    />
                </View>

                <Text style={[styles.title, { color: theme.text }]}>
                    Page Not Found
                </Text>
                
                <Text style={[styles.subtitle, { color: theme.secondaryText }]}>
                    Oops! The page you`&apos;`re looking for seems to have vanished into the digital void.
                </Text>

                <View style={styles.statsContainer}>
                    <View style={[styles.statItem, { backgroundColor: isDark ? '#2D2D2D' : '#F8FAFC' }]}>
                        <Text style={[styles.statNumber, { color: theme.accent }]}>404</Text>
                        <Text style={[styles.statLabel, { color: theme.secondaryText }]}>Error Code</Text>
                    </View>
                    <View style={[styles.statItem, { backgroundColor: isDark ? '#2D2D2D' : '#F8FAFC' }]}>
                        <Text style={[styles.statNumber, { color: theme.accent }]}>⚽</Text>
                        <Text style={[styles.statLabel, { color: theme.secondaryText }]}>Match Lost</Text>
                    </View>
                </View>

                <TouchableOpacity 
                    style={[styles.button, { backgroundColor: theme.accent }]}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.buttonText}>Return to Safety</Text>
                    <View style={[styles.buttonIcon, { backgroundColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.3)' }]}>
                        <Text style={styles.buttonIconText}>↩</Text>
                    </View>
                </TouchableOpacity>

                <Text style={[styles.footerText, { color: theme.secondaryText }]}>
                    While you`&apos;`re here, why not check our latest matches?
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        position: 'relative',
    },
    backgroundOrb: {
        position: 'absolute',
        width: 200,
        height: 200,
        borderRadius: 100,
        opacity: 0.4,
        filter: 'blur(40px)',
    },
    content: {
        width: '90%',
        maxWidth: 400,
        padding: 30,
        borderRadius: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    illustrationContainer: {
        width: 180,
        height: 180,
        borderRadius: 20,
        marginBottom: 25,
        justifyContent: 'center',
        alignItems: 'center',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 6,
        overflow: 'hidden',
        transform: [{ rotate: '-5deg' }],
    },
    illustration: {
        width: 160,
        height: 160,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        marginBottom: 12,
        textAlign: 'center',
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 14,
        fontWeight: '400',
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 20,
        opacity: 0.8,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20,
        marginBottom: 30,
    },
    statItem: {
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        minWidth: 100,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    statNumber: {
        fontSize: 20,
        fontWeight: '800',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 11,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
        marginRight: 12,
    },
    buttonIcon: {
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonIconText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '800',
    },
    footerText: {
        fontSize: 12,
        fontWeight: '500',
        textAlign: 'center',
        opacity: 0.7,
    },
});

export default NotFound;