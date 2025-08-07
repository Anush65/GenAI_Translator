import React, { useState, useEffect } from 'react';
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
  Slider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { motion } from 'framer-motion';
import { StyleRounded, TuneRounded, ExpandMoreRounded, ContentCopyRounded } from '@mui/icons-material';
import { apiService } from '../services/api';
import { Style, StyleTransformResponse } from '../types/api';

const StyleTransformTab: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [targetStyle, setTargetStyle] = useState('formal');
  const [context, setContext] = useState('');
  const [creativityLevel, setCreativityLevel] = useState(0.7);
  const [loading, setLoading] = useState(false);
  const [styles, setStyles] = useState<Style>({});

  useEffect(() => {
    const loadStyles = async () => {
      try {
        const stylesData = await apiService.getStyles();
        setStyles(stylesData.styles);
      } catch (error) {
        console.error('Error loading styles:', error);
      }
    };

    loadStyles();
  }, []);

  const handleTransform = async () => {
    if (!inputText.trim()) return;

    setLoading(true);
    try {
      const response: StyleTransformResponse = await apiService.transformStyle({
        text: inputText,
        target_style: targetStyle,
        context: context || undefined,
        creativity_level: creativityLevel,
      });

      setOutputText(response.transformed_text);
    } catch (error) {
      console.error('Style transformation error:', error);
      setOutputText('Style transformation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(outputText);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const creativityMarks = [
    { value: 0.1, label: 'Conservative' },
    { value: 0.5, label: 'Balanced' },
    { value: 0.9, label: 'Creative' },
  ];

  const exampleTransformations = [
    {
      text: "Hey, what's up? Can you help me with this?",
      style: "formal",
      label: "Casual → Formal"
    },
    {
      text: "The meeting will commence at 3 PM sharp.",
      style: "casual",
      label: "Formal → Casual"
    },
    {
      text: "The sun was shining brightly in the clear blue sky.",
      style: "poetic",
      label: "Simple → Poetic"
    },
    {
      text: "This is a really good idea for our project.",
      style: "shakespearean",
      label: "Modern → Shakespearean"
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Grid container spacing={3}>
        {/* Style Controls */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Target Style</InputLabel>
                  <Select
                    value={targetStyle}
                    onChange={(e) => setTargetStyle(e.target.value)}
                    label="Target Style"
                  >
                    {Object.entries(styles).map(([key, description]) => (
                      <MenuItem key={key} value={key}>
                        <Box>
                          <Typography variant="body1">
                            {key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' ')}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {description}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Context (Optional)"
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="e.g., business email, academic paper..."
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleTransform}
                  disabled={loading || !inputText.trim()}
                  startIcon={loading ? <CircularProgress size={20} /> : <StyleRounded />}
                >
                  {loading ? 'Transforming...' : 'Transform Style'}
                </Button>
              </Grid>
            </Grid>

            {/* Advanced Controls */}
            <Accordion sx={{ mt: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreRounded />}>
                <TuneRounded sx={{ mr: 1 }} />
                <Typography>Advanced Settings</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ px: 2 }}>
                  <Typography gutterBottom>Creativity Level</Typography>
                  <Slider
                    value={creativityLevel}
                    onChange={(_, value) => setCreativityLevel(value as number)}
                    min={0.1}
                    max={0.9}
                    step={0.1}
                    marks={creativityMarks}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${Math.round(value * 100)}%`}
                  />
                  <Typography variant="caption" color="text.secondary">
                    Higher values produce more creative and varied transformations
                  </Typography>
                </Box>
              </AccordionDetails>
            </Accordion>
          </Paper>
        </Grid>

        {/* Input and Output Text Areas */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '400px', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              Original Text
            </Typography>
            <TextField
              multiline
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter text to transform..."
              variant="outlined"
              sx={{ flexGrow: 1 }}
              InputProps={{
                sx: { 
                  height: '100%', 
                  alignItems: 'flex-start',
                  overflow: 'auto',
                  wordBreak: 'break-word',
                  whiteSpace: 'pre-wrap'
                },
              }}
              inputProps={{
                style: {
                  resize: 'none',
                  overflow: 'auto',
                  wordWrap: 'break-word',
                  whiteSpace: 'pre-wrap'
                }
              }}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '400px', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Transformed Text</Typography>
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
              placeholder="Transformed text will appear here..."
              variant="outlined"
              InputProps={{
                readOnly: true,
                sx: { 
                  height: '100%', 
                  alignItems: 'flex-start',
                  overflow: 'auto',
                  wordBreak: 'break-word',
                  whiteSpace: 'pre-wrap'
                },
              }}
              inputProps={{
                style: {
                  resize: 'none',
                  overflow: 'auto',
                  wordWrap: 'break-word',
                  whiteSpace: 'pre-wrap'
                }
              }}
              sx={{ flexGrow: 1 }}
            />
          </Paper>
        </Grid>

        {/* Example Transformations */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Try These Transformations:
            </Typography>
            <Grid container spacing={2}>
              {exampleTransformations.map((example, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Paper 
                    sx={{ 
                      p: 2, 
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
                      setTargetStyle(example.style);
                    }}
                  >
                    <Chip 
                      label={example.label} 
                      size="small" 
                      color="primary" 
                      sx={{ mb: 1 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      "{example.text}"
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Style Information */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Style Guide
            </Typography>
            <Grid container spacing={2}>
              {Object.entries(styles).slice(0, 6).map(([style, description]) => (
                <Grid item xs={12} md={4} key={style}>
                  <Box sx={{ p: 1 }}>
                    <Typography variant="subtitle2" color="primary">
                      {style.charAt(0).toUpperCase() + style.slice(1).replace('_', ' ')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {description}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </motion.div>
  );
};

export default StyleTransformTab;