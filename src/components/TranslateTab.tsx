import React, { useState, useEffect, useContext } from 'react';
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Chip,
  SelectChangeEvent,
} from '@mui/material';
import { motion } from 'framer-motion';
import { TranslateRounded, SwapHorizRounded, ContentCopyRounded } from '@mui/icons-material';
import { apiService } from '../services/api';
import { Language, Style, TranslateResponse } from '../types/api';
import { ThemeContext } from '../App';

const TranslateTab: React.FC = () => {
  const { darkMode } = useContext(ThemeContext);
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('auto');
  const [targetLanguage, setTargetLanguage] = useState('es');
  const [style, setStyle] = useState('neutral');
  const [loading, setLoading] = useState(false);
  const [languages, setLanguages] = useState<Language>({});
  const [styles, setStyles] = useState<Style>({});
  const [detectedLanguage, setDetectedLanguage] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [languagesData, stylesData] = await Promise.all([
          apiService.getLanguages(),
          apiService.getStyles(),
        ]);
        setLanguages(languagesData.languages);
        setStyles(stylesData.styles);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, []);

  const handleTranslate = async () => {
    if (!inputText.trim()) return;

    setLoading(true);
    try {
      const response: TranslateResponse = await apiService.translateText({
        text: inputText,
        target_language: targetLanguage,
        source_language: sourceLanguage === 'auto' ? undefined : sourceLanguage,
        style,
        preserve_formatting: true,
      });

      setOutputText(response.translated_text);
      setDetectedLanguage(response.source_language);
    } catch (error) {
      console.error('Translation error:', error);
      setOutputText('Translation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSwapLanguages = () => {
    if (sourceLanguage !== 'auto' && targetLanguage !== 'auto') {
      setSourceLanguage(targetLanguage);
      setTargetLanguage(sourceLanguage);
      setInputText(outputText);
      setOutputText(inputText);
    }
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(outputText);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const handleLanguageChange = (event: SelectChangeEvent, type: 'source' | 'target') => {
    const value = event.target.value;
    if (type === 'source') {
      setSourceLanguage(value);
    } else {
      setTargetLanguage(value);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Grid container spacing={3}>
        {/* Language and Style Controls */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Source Language</InputLabel>
                  <Select
                    value={sourceLanguage}
                    onChange={(e) => handleLanguageChange(e, 'source')}
                    label="Source Language"
                  >
                    <MenuItem value="auto">Auto Detect</MenuItem>
                    {Object.entries(languages).map(([code, name]) => (
                      <MenuItem key={code} value={code}>
                        {name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={1} sx={{ textAlign: 'center' }}>
                <Button
                  onClick={handleSwapLanguages}
                  disabled={sourceLanguage === 'auto'}
                  sx={{ minWidth: 'auto', p: 1 }}
                >
                  <SwapHorizRounded />
                </Button>
              </Grid>

              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Target Language</InputLabel>
                  <Select
                    value={targetLanguage}
                    onChange={(e) => handleLanguageChange(e, 'target')}
                    label="Target Language"
                  >
                    {Object.entries(languages).map(([code, name]) => (
                      <MenuItem key={code} value={code}>
                        {name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Style</InputLabel>
                  <Select
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    label="Style"
                  >
                    {Object.entries(styles).map(([key, description]) => (
                      <MenuItem key={key} value={key}>
                        {key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' ')}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={2}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleTranslate}
                  disabled={loading || !inputText.trim()}
                  startIcon={loading ? <CircularProgress size={20} /> : <TranslateRounded />}
                >
                  {loading ? 'Translating...' : 'Translate'}
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Input and Output Text Areas */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '400px', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Input Text</Typography>
              {detectedLanguage && (
                <Chip
                  label={`Detected: ${languages[detectedLanguage] || detectedLanguage}`}
                  size="small"
                  color="primary"
                />
              )}
            </Box>
            <TextField
              multiline
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter text to translate..."
              variant="outlined"
              sx={{ 
                flexGrow: 1,
                '& .MuiInputBase-root': {
                  height: '100%',
                  alignItems: 'flex-start',
                },
                '& .MuiInputBase-input': {
                  height: '100% !important',
                  overflow: 'auto !important',
                  wordBreak: 'break-word',
                  whiteSpace: 'pre-wrap',
                  resize: 'none',
                }
              }}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '400px', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Translated Text</Typography>
              {outputText && (
                <Button
                  size="small"
                  onClick={handleCopyToClipboard}
                  startIcon={<ContentCopyRounded />}
                >
                  Copy
                </Button>
              )}
            </Box>
            <TextField
              multiline
              value={outputText}
              placeholder="Translation will appear here..."
              variant="outlined"
              InputProps={{
                readOnly: true,
              }}
              sx={{ 
                flexGrow: 1,
                '& .MuiInputBase-root': {
                  height: '100%',
                  alignItems: 'flex-start',
                },
                '& .MuiInputBase-input': {
                  height: '100% !important',
                  overflow: 'auto !important',
                  wordBreak: 'break-word',
                  whiteSpace: 'pre-wrap',
                  resize: 'none',
                }
              }}
            />
          </Paper>
        </Grid>

        {/* Example Translations */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Try These Examples:
            </Typography>
            <Grid container spacing={1}>
              {[
                "Hello, how are you today?",
                "The weather is beautiful this morning.",
                "I love learning new languages!",
                "Technology is changing the world rapidly.",
              ].map((example, index) => (
                <Grid item key={index}>
                  <Chip
                    label={example}
                    onClick={() => setInputText(example)}
                    sx={{ cursor: 'pointer' }}
                    variant="outlined"
                  />
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </motion.div>
  );
};

export default TranslateTab;