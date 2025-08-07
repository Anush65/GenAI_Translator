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
  Card,
  CardContent,
  CardActions,
  ButtonGroup,
  Slider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { motion } from 'framer-motion';
import { 
  AutoAwesomeRounded, 
  ContentCopyRounded, 
  MusicNoteRounded,
  BookRounded,
  FormatQuoteRounded,
  EmojiEmotionsRounded,
  TheaterComedyRounded,
  TuneRounded,
  ExpandMoreRounded
} from '@mui/icons-material';
import { apiService } from '../services/api';
import { CreativeType, CreativeResponse } from '../types/api';

const CreativeTab: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [creativeType, setCreativeType] = useState('poem');
  const [theme, setTheme] = useState('');
  const [mood, setMood] = useState('neutral');
  const [creativityLevel, setCreativityLevel] = useState(0.7);
  const [loading, setLoading] = useState(false);
  const [creativeTypes, setCreativeTypes] = useState<CreativeType[]>([]);

  const moods = [
    { value: 'joyful', label: 'Joyful', icon: '😊' },
    { value: 'melancholy', label: 'Melancholy', icon: '😔' },
    { value: 'mysterious', label: 'Mysterious', icon: '🔮' },
    { value: 'romantic', label: 'Romantic', icon: '💕' },
    { value: 'energetic', label: 'Energetic', icon: '⚡' },
    { value: 'peaceful', label: 'Peaceful', icon: '🕊️' },
    { value: 'dramatic', label: 'Dramatic', icon: '🎭' },
    { value: 'neutral', label: 'Neutral', icon: '😐' },
  ];

  useEffect(() => {
    const loadCreativeTypes = async () => {
      try {
        const typesData = await apiService.getCreativeTypes();
        setCreativeTypes(typesData.creative_types);
      } catch (error) {
        console.error('Error loading creative types:', error);
      }
    };

    loadCreativeTypes();
  }, []);

  const handleCreateContent = async () => {
    if (!inputText.trim()) return;

    setLoading(true);
    try {
      const response: CreativeResponse = await apiService.createCreative({
        text: inputText,
        creative_type: creativeType,
        theme: theme || undefined,
        mood,
        creativity_level: creativityLevel,
      });

      setOutputText(response.creative_content);
    } catch (error) {
      console.error('Creative content error:', error);
      setOutputText('Creative content generation failed. Please try again.');
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

  const getCreativeIcon = (type: string, color = '#667eea') => {
    const iconProps = { sx: { color } };
    switch (type) {
      case 'poem': return <FormatQuoteRounded {...iconProps} />;
      case 'song': return <MusicNoteRounded {...iconProps} />;
      case 'story': return <BookRounded {...iconProps} />;
      case 'haiku': return <FormatQuoteRounded {...iconProps} />;
      case 'rap': return <MusicNoteRounded {...iconProps} />;
      case 'dialogue': return <TheaterComedyRounded {...iconProps} />;
      default: return <AutoAwesomeRounded {...iconProps} />;
    }
  };

  const creativityMarks = [
    { value: 0.1, label: 'Conservative' },
    { value: 0.5, label: 'Balanced' },
    { value: 0.9, label: 'Creative' },
  ];

  const examplePrompts = [
    {
      text: "A lonely lighthouse keeper watching ships pass by",
      type: "poem",
      theme: "solitude",
      mood: "melancholy"
    },
    {
      text: "Dancing under the stars on a summer night",
      type: "song",
      theme: "love",
      mood: "romantic"
    },
    {
      text: "A cat discovers a hidden door in the attic",
      type: "story",
      theme: "adventure",
      mood: "mysterious"
    },
    {
      text: "Morning coffee and newspaper",
      type: "haiku",
      theme: "daily life",
      mood: "peaceful"
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Grid container spacing={3}>
        {/* Creative Controls */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Creative Type</InputLabel>
                  <Select
                    value={creativeType}
                    onChange={(e) => setCreativeType(e.target.value)}
                    label="Creative Type"
                  >
                    {creativeTypes.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {getCreativeIcon(type.value)}
                          <Box>
                            <Typography variant="body1">{type.label}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {type.description}
                            </Typography>
                          </Box>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Theme (Optional)"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  placeholder="e.g., love, nature, adventure..."
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Mood</InputLabel>
                  <Select
                    value={mood}
                    onChange={(e) => setMood(e.target.value)}
                    label="Mood"
                  >
                    {moods.map((moodOption) => (
                      <MenuItem key={moodOption.value} value={moodOption.value}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <span>{moodOption.icon}</span>
                          {moodOption.label}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={3}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleCreateContent}
                  disabled={loading || !inputText.trim()}
                  startIcon={loading ? <CircularProgress size={20} /> : <AutoAwesomeRounded />}
                >
                  {loading ? 'Creating...' : 'Create'}
                </Button>
              </Grid>
            </Grid>

            {/* Creative Level Settings */}
            <Accordion sx={{ mt: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreRounded />}>
                <TuneRounded sx={{ mr: 1 }} />
                <Typography>Creative Settings</Typography>
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
                    Higher values produce more creative and varied content
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
              Input Text or Inspiration
            </Typography>
                         <TextField
               multiline
               value={inputText}
               onChange={(e) => setInputText(e.target.value)}
               placeholder="Enter text, an idea, or inspiration..."
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
              <Typography variant="h6">Creative Output</Typography>
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
               placeholder="Your creative content will appear here..."
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
                   fontFamily: creativeType === 'poem' || creativeType === 'haiku' ? 'serif' : 'inherit',
                 }
               }}
             />
          </Paper>
        </Grid>

        {/* Creative Type Showcase */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Creative Formats
            </Typography>
            <Grid container spacing={2}>
              {creativeTypes.map((type) => (
                <Grid item xs={12} sm={6} md={4} key={type.value}>
                  <Card 
                    sx={{ 
                      cursor: 'pointer',
                      border: creativeType === type.value ? '2px solid #667eea' : '1px solid rgba(255,255,255,0.1)',
                      '&:hover': { 
                        transform: 'translateY(-2px)',
                        transition: 'all 0.2s'
                      }
                    }}
                    onClick={() => setCreativeType(type.value)}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        {getCreativeIcon(type.value)}
                        <Typography variant="h6">{type.label}</Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {type.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Example Prompts */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Try These Creative Prompts:
            </Typography>
            <Grid container spacing={2}>
              {examplePrompts.map((example, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Card 
                    sx={{ 
                      cursor: 'pointer',
                      '&:hover': { 
                        background: 'rgba(102, 126, 234, 0.05)',
                        transform: 'translateY(-2px)',
                        transition: 'all 0.2s'
                      }
                    }}
                    onClick={() => {
                      setInputText(example.text);
                      setCreativeType(example.type);
                      setTheme(example.theme);
                      setMood(example.mood);
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                        <Chip 
                          label={example.type} 
                          size="small" 
                          color="primary"
                          icon={getCreativeIcon(example.type)}
                        />
                        <Chip 
                          label={example.mood} 
                          size="small" 
                          variant="outlined"
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        "{example.text}"
                      </Typography>
                      {example.theme && (
                        <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                          Theme: {example.theme}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Mood Guide */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Mood Selection Guide
            </Typography>
            <Grid container spacing={1}>
              {moods.map((moodOption) => (
                <Grid item key={moodOption.value}>
                  <Chip
                    label={`${moodOption.icon} ${moodOption.label}`}
                    onClick={() => setMood(moodOption.value)}
                    color={mood === moodOption.value ? 'primary' : 'default'}
                    variant={mood === moodOption.value ? 'filled' : 'outlined'}
                    sx={{ cursor: 'pointer' }}
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

export default CreativeTab;