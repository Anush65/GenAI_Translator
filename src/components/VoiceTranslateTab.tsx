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
  IconButton,
  Card,
  CardContent,
  Slider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { motion } from 'framer-motion';
import { 
  MicRounded, 
  MicOffRounded, 
  VolumeUpRounded,
  ContentCopyRounded,
  TranslateRounded,
  TuneRounded,
  ExpandMoreRounded,
  RecordVoiceOverRounded
} from '@mui/icons-material';
import { apiService } from '../services/api';
import { Language, Style, TranslateResponse } from '../types/api';
import { ThemeContext } from '../App';

const VoiceTranslateTab: React.FC = () => {
  const { darkMode } = useContext(ThemeContext);
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('auto');
  const [targetLanguage, setTargetLanguage] = useState('es');
  const [style, setStyle] = useState('neutral');
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [languages, setLanguages] = useState<Language>({});
  const [styles, setStyles] = useState<Style>({});
  const [detectedLanguage, setDetectedLanguage] = useState('');
  const [voiceSpeed, setVoiceSpeed] = useState(1.0);
  const [voicePitch, setVoicePitch] = useState(1.0);

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

  const handleVoiceInput = () => {
    if (!isRecording) {
      // Start voice recording simulation
      setIsRecording(true);
      // Simulate voice input after 3 seconds
      setTimeout(() => {
        setIsRecording(false);
        setInputText("Hello, this is a voice input demonstration. How are you today?");
      }, 3000);
    } else {
      setIsRecording(false);
    }
  };

  const handleVoiceOutput = () => {
    if (!isPlaying && outputText) {
      setIsPlaying(true);
      // Simulate text-to-speech
      setTimeout(() => {
        setIsPlaying(false);
      }, 2000);
    } else {
      setIsPlaying(false);
    }
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(outputText);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const voiceSpeedMarks = [
    { value: 0.5, label: 'Slow' },
    { value: 1.0, label: 'Normal' },
    { value: 1.5, label: 'Fast' },
  ];

  const voicePitchMarks = [
    { value: 0.5, label: 'Low' },
    { value: 1.0, label: 'Normal' },
    { value: 1.5, label: 'High' },
  ];

  const exampleVoicePrompts = [
    {
      text: "Good morning, how can I help you today?",
      source: "en",
      target: "es",
      style: "formal"
    },
    {
      text: "I would like to order a coffee, please.",
      source: "en",
      target: "fr",
      style: "polite"
    },
    {
      text: "The weather is beautiful today!",
      source: "en",
      target: "de",
      style: "casual"
    },
    {
      text: "Thank you for your assistance.",
      source: "en",
      target: "ja",
      style: "formal"
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Grid container spacing={3}>
        {/* Voice Controls */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Source Language</InputLabel>
                  <Select
                    value={sourceLanguage}
                    onChange={(e) => setSourceLanguage(e.target.value)}
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

              <Grid item xs={12} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Target Language</InputLabel>
                  <Select
                    value={targetLanguage}
                    onChange={(e) => setTargetLanguage(e.target.value)}
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

              <Grid item xs={12} md={2}>
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

              <Grid item xs={12} md={3}>
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

              <Grid item xs={12} md={3}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={handleVoiceInput}
                    disabled={isRecording}
                    startIcon={isRecording ? <CircularProgress size={20} /> : <MicRounded />}
                    color={isRecording ? 'error' : 'primary'}
                  >
                    {isRecording ? 'Recording...' : 'Voice Input'}
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={handleVoiceOutput}
                    disabled={isPlaying || !outputText}
                    startIcon={isPlaying ? <CircularProgress size={20} /> : <VolumeUpRounded />}
                  >
                    {isPlaying ? 'Playing...' : 'Voice Output'}
                  </Button>
                </Box>
              </Grid>
            </Grid>

            {/* Voice Settings */}
            <Accordion sx={{ mt: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreRounded />}>
                <TuneRounded sx={{ mr: 1 }} />
                <Typography>Voice Settings</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography gutterBottom>Voice Speed</Typography>
                    <Slider
                      value={voiceSpeed}
                      onChange={(_, value) => setVoiceSpeed(value as number)}
                      min={0.5}
                      max={1.5}
                      step={0.1}
                      marks={voiceSpeedMarks}
                      valueLabelDisplay="auto"
                      valueLabelFormat={(value) => `${value}x`}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography gutterBottom>Voice Pitch</Typography>
                    <Slider
                      value={voicePitch}
                      onChange={(_, value) => setVoicePitch(value as number)}
                      min={0.5}
                      max={1.5}
                      step={0.1}
                      marks={voicePitchMarks}
                      valueLabelDisplay="auto"
                      valueLabelFormat={(value) => `${value}x`}
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Paper>
        </Grid>

        {/* Input and Output Text Areas */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '400px', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Voice Input / Text</Typography>
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
              placeholder="Speak or type your text here..."
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
              <Typography variant="h6">Voice Output / Translation</Typography>
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
              placeholder="Translation and voice output will appear here..."
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

        {/* Voice Translation Examples */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Try These Voice Translations:
            </Typography>
            <Grid container spacing={2}>
              {exampleVoicePrompts.map((example, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Card 
                    sx={{ 
                      cursor: 'pointer',
                      border: '1px solid rgba(255,255,255,0.1)',
                      '&:hover': { 
                        background: 'rgba(102, 126, 234, 0.05)',
                        transform: 'translateY(-2px)',
                        transition: 'all 0.2s'
                      }
                    }}
                    onClick={() => {
                      setInputText(example.text);
                      setSourceLanguage(example.source);
                      setTargetLanguage(example.target);
                      setStyle(example.style);
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                        <Chip 
                          label={`${languages[example.source] || example.source} → ${languages[example.target] || example.target}`}
                          size="small" 
                          color="primary"
                          icon={<RecordVoiceOverRounded />}
                        />
                        <Chip 
                          label={example.style} 
                          size="small" 
                          variant="outlined"
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        "{example.text}"
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Voice Features Guide */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Voice Translation Features
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <MicRounded color="primary" />
                  <Typography variant="subtitle1">Voice Input</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Speak naturally and have your voice converted to text for translation
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <VolumeUpRounded color="primary" />
                  <Typography variant="subtitle1">Voice Output</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Listen to the translated text with adjustable speed and pitch
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <TuneRounded color="primary" />
                  <Typography variant="subtitle1">Voice Settings</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Customize voice speed and pitch for optimal listening experience
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </motion.div>
  );
};

export default VoiceTranslateTab;