import React, { useState, createContext, useContext, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { 
  CssBaseline, 
  Container, 
  Paper, 
  Tabs, 
  Tab, 
  Box, 
  Typography, 
  AppBar, 
  Toolbar,
  IconButton,
  Switch,
  FormControlLabel
} from '@mui/material';
import { 
  TranslateRounded, 
  RecordVoiceOverRounded, 
  AutoAwesomeRounded, 
  AnalyticsRounded,
  DarkModeRounded,
  LightModeRounded
} from '@mui/icons-material';
import TranslateTab from './components/TranslateTab';
import VoiceTranslateTab from './components/VoiceTranslateTab';
import CreativeTab from './components/CreativeTab';
import AnalyzeTab from './components/AnalyzeTab';
import ParticleBackground from './components/ParticleBackground';

// Theme Context
const ThemeContext = createContext({
  darkMode: true,
  toggleDarkMode: () => {},
});

   const createAppTheme = (darkMode: boolean) => createTheme({
  palette: {
    mode: darkMode ? 'dark' : 'light',
    primary: {
      main: darkMode ? '#8b5cf6' : '#6366f1',
      light: darkMode ? '#c084fc' : '#93c5fd',
      dark: darkMode ? '#6d28d9' : '#4338ca',
    },
    secondary: {
      main: darkMode ? '#06b6d4' : '#14b8a6',
      light: darkMode ? '#22d3ee' : '#5eead4',
      dark: darkMode ? '#0e7490' : '#0f766e',
    },
    background: {
      default: darkMode ? 'transparent' : 'rgba(248, 250, 252, 0.98)',
      paper: darkMode ? 'rgba(255, 255, 255, 0.06)' : 'rgba(255, 255, 255, 0.9)',
    },
    text: {
      primary: darkMode ? '#f5f7ff' : '#0f172a',
      secondary: darkMode ? 'rgba(235, 238, 255, 0.75)' : 'rgba(15, 23, 42, 0.7)',
    },
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
    h4: {
      fontWeight: 600,
      letterSpacing: '-0.5px',
    },
  },
  components: {
            MuiPaper: {
          styleOverrides: {
            root: {
              backdropFilter: 'blur(20px)',
              border: darkMode 
                ? '1px solid rgba(255, 255, 255, 0.08)' 
                : '1px solid rgba(0, 0, 0, 0.06)',
              boxShadow: darkMode
                ? '0 8px 32px rgba(0, 0, 0, 0.4)'
                : '0 8px 32px rgba(0, 0, 0, 0.08)',
            },
          },
        },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '1rem',
          color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(26, 32, 44, 0.7)',
          '&.Mui-selected': {
            color: darkMode ? '#fbbf24' : '#f59e0b', // Golden yellow for selected tabs
            fontWeight: 600,
          },
          '&:hover': {
            color: darkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(26, 32, 44, 0.9)',
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: darkMode ? '#fbbf24' : '#f59e0b', // Golden yellow indicator
          height: 3,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        contained: {
          background: darkMode 
            ? 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)'
            : 'linear-gradient(45deg, #5a67d8 30%, #9333ea 90%)',
          boxShadow: darkMode
            ? '0 3px 5px 2px rgba(102, 126, 234, .3)'
            : '0 3px 5px 2px rgba(90, 103, 216, .3)',
          color: '#ffffff',
          '& .MuiSvgIcon-root': {
            color: '#ffffff',
          },
        },
        outlined: {
          borderColor: darkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
          color: darkMode ? '#ffffff' : '#1a202c',
          '& .MuiSvgIcon-root': {
            color: darkMode ? '#ffffff' : '#1a202c',
          },
        },
        text: {
          color: darkMode ? '#ffffff' : '#1a202c',
          '& .MuiSvgIcon-root': {
            color: darkMode ? '#ffffff' : '#1a202c',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: darkMode ? '#ffffff' : '#1a202c',
          '&:hover': {
            backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
          },
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          color: darkMode ? 'rgba(255, 255, 255, 0.87)' : 'rgba(26, 32, 44, 0.87)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
          color: darkMode ? '#ffffff' : '#1a202c',
          '& .MuiSvgIcon-root': {
            color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(26, 32, 44, 0.7)',
          },
        },
        outlined: {
          borderColor: darkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
          color: darkMode ? '#ffffff' : '#1a202c',
        },
      },
    },
  },
});

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function App() {
  const [tabValue, setTabValue] = useState(0);
  const [darkMode, setDarkMode] = useState(true);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Update body class when theme changes
  useEffect(() => {
    if (darkMode) {
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
    }
  }, [darkMode]);

  const theme = createAppTheme(darkMode);

  const tabs = [
    { label: 'Translate', icon: <TranslateRounded />, component: <TranslateTab /> },
    { label: 'Voice Translate', icon: <RecordVoiceOverRounded />, component: <VoiceTranslateTab /> },
    { label: 'Creative', icon: <AutoAwesomeRounded />, component: <CreativeTab /> },
    { label: 'Analyze', icon: <AnalyticsRounded />, component: <AnalyzeTab /> },
  ];

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ParticleBackground darkMode={darkMode} />
        
                  <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
                             style={{ 
               minHeight: '100vh', 
               position: 'relative', 
               zIndex: 1,
               background: darkMode 
                 ? 'radial-gradient(1200px 700px at 20% 10%, rgba(139, 92, 246, 0.18), rgba(0,0,0,0)) , radial-gradient(1000px 600px at 80% 30%, rgba(6, 182, 212, 0.16), rgba(0,0,0,0)) , linear-gradient(135deg, rgba(12, 16, 38, 0.9) 0%, rgba(18, 10, 34, 0.9) 100%)'
                 : 'radial-gradient(1200px 700px at 20% 10%, rgba(99, 102, 241, 0.25), rgba(255,255,255,0)) , radial-gradient(900px 500px at 85% 25%, rgba(20, 184, 166, 0.22), rgba(255,255,255,0)) , linear-gradient(135deg, rgba(245, 248, 255, 0.96) 0%, rgba(243, 240, 255, 0.96) 100%)'
             }}
          >
                      <AppBar 
              position="static" 
              sx={{ 
                                 background: darkMode 
                  ? 'linear-gradient(180deg, rgba(20, 12, 40, 0.7) 0%, rgba(10, 16, 38, 0.6) 100%)' 
                  : 'linear-gradient(180deg, rgba(255, 255, 255, 0.85) 0%, rgba(255,255,255,0.75) 100%)', 
                backdropFilter: 'blur(22px)',
                borderBottom: darkMode 
                  ? '1px solid rgba(139, 92, 246, 0.25)'
                  : '1px solid rgba(99, 102, 241, 0.2)'
              }}
            >
                         <Toolbar sx={{ minHeight: 72 }}>
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                style={{ flexGrow: 1 }}
              >
                                 <Typography variant="h4" component="div" sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 2,
                  color: darkMode ? '#ffffff' : '#1a202c'
                }}>
                  <img src="/logo.svg" alt="CLT Logo" style={{ width: 32, height: 32 }} />
                  Creative Language Translator
                </Typography>
              </motion.div>
              
              {/* Theme Toggle */}
                             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LightModeRounded sx={{ 
                  color: darkMode ? 'rgba(255,255,255,0.55)' : '#f59e0b' 
                }} />
                <Switch
                  checked={darkMode}
                  onChange={toggleDarkMode}
                  sx={{
                    '& .MuiSwitch-thumb': {
                      backgroundColor: darkMode ? '#667eea' : '#f59e0b',
                    },
                    '& .MuiSwitch-track': {
                      backgroundColor: darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
                    },
                  }}
                />
                <DarkModeRounded sx={{ 
                  color: darkMode ? '#667eea' : 'rgba(0,0,0,0.5)' 
                }} />
              </Box>
            </Toolbar>
          </AppBar>

          <Container maxWidth="xl" sx={{ py: 4 }}>
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Paper elevation={4} sx={{ 
                borderRadius: 3, 
                overflow: 'hidden',
                background: darkMode
                  ? 'rgba(255, 255, 255, 0.03)'
                  : 'rgba(255, 255, 255, 0.9)'
              }}>
                                 <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  variant="fullWidth"
                  sx={{
                    borderBottom: darkMode 
                      ? '1px solid rgba(139, 92, 246, 0.25)'
                      : '1px solid rgba(99, 102, 241, 0.2)',
                    '& .MuiTab-root': {
                      py: 2,
                      minHeight: 'auto',
                    },
                  }}
                >
                  {tabs.map((tab, index) => (
                    <Tab
                      key={index}
                      label={tab.label}
                      icon={tab.icon}
                      iconPosition="start"
                      sx={{
                        '&.Mui-selected': {
                          background: darkMode 
                            ? 'linear-gradient(45deg, rgba(251, 191, 36, 0.1), rgba(245, 158, 11, 0.1))'
                            : 'linear-gradient(45deg, rgba(245, 158, 11, 0.1), rgba(217, 119, 6, 0.1))',
                        },
                        '&:hover': {
                          background: darkMode
                            ? 'rgba(255, 255, 255, 0.05)'
                            : 'rgba(0, 0, 0, 0.03)',
                        },
                      }}
                    />
                  ))}
                </Tabs>

                <AnimatePresence mode="wait">
                  {tabs.map((tab, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: tabValue > index ? -50 : 50 }}
                      animate={{ opacity: tabValue === index ? 1 : 0, x: tabValue === index ? 0 : (tabValue > index ? -50 : 50) }}
                      exit={{ opacity: 0, x: tabValue > index ? -50 : 50 }}
                      transition={{ duration: 0.3 }}
                    >
                      <TabPanel value={tabValue} index={index}>
                        {tab.component}
                      </TabPanel>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </Paper>
            </motion.div>
          </Container>
        </motion.div>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

export { ThemeContext };
export default App;
