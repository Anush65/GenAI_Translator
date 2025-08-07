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
      main: darkMode ? '#667eea' : '#5a67d8',
      light: darkMode ? '#8fa4f3' : '#7c3aed',
      dark: darkMode ? '#4c63d2' : '#4338ca',
    },
    secondary: {
      main: darkMode ? '#764ba2' : '#9333ea',
      light: darkMode ? '#9575cd' : '#a855f7',
      dark: darkMode ? '#512da8' : '#7c2d12',
    },
    background: {
      default: darkMode ? 'transparent' : 'rgba(248, 250, 252, 0.98)',
      paper: darkMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(255, 255, 255, 0.9)',
    },
    text: {
      primary: darkMode ? '#ffffff' : '#1a202c',
      secondary: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(26, 32, 44, 0.7)',
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
                ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)'
                : 'linear-gradient(135deg, rgba(219, 234, 254, 0.9) 0%, rgba(233, 213, 255, 0.9) 100%)'
            }}
          >
                      <AppBar 
              position="static" 
              sx={{ 
                background: darkMode 
                  ? 'rgba(255, 255, 255, 0.03)' 
                  : 'rgba(255, 255, 255, 0.8)', 
                backdropFilter: 'blur(20px)',
                borderBottom: darkMode 
                  ? '1px solid rgba(255, 255, 255, 0.08)'
                  : '1px solid rgba(0, 0, 0, 0.06)'
              }}
            >
            <Toolbar>
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
                  <AutoAwesomeRounded sx={{ 
                    fontSize: 32, 
                    color: darkMode ? '#667eea' : '#5a67d8'
                  }} />
                  Creative Language Translator
                </Typography>
              </motion.div>
              
              {/* Theme Toggle */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LightModeRounded sx={{ 
                  color: darkMode ? 'rgba(255,255,255,0.5)' : '#f59e0b' 
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
                      ? '1px solid rgba(255, 255, 255, 0.1)'
                      : '1px solid rgba(0, 0, 0, 0.08)',
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
