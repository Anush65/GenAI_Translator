import React, { useState } from 'react';
import {
  Grid,
  TextField,
  Button,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Chip,
  Card,
  CardContent,
  LinearProgress,
} from '@mui/material';
import { motion } from 'framer-motion';
import { 
  AnalyticsRounded, 
  LanguageRounded,
  SentimentSatisfiedRounded,
  SentimentDissatisfiedRounded,
  SentimentNeutralRounded,
  TextFieldsRounded,
  TrendingUpRounded
} from '@mui/icons-material';
import { apiService } from '../services/api';
import { AnalyzeResponse } from '../types/api';

const AnalyzeTab: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [analysis, setAnalysis] = useState<AnalyzeResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;

    setLoading(true);
    try {
      const response: AnalyzeResponse = await apiService.analyzeText({
        text: inputText,
      });

      setAnalysis(response);
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <SentimentSatisfiedRounded sx={{ color: '#4ade80' }} />;
      case 'negative': return <SentimentDissatisfiedRounded sx={{ color: '#f87171' }} />;
      default: return <SentimentNeutralRounded sx={{ color: '#94a3b8' }} />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'success';
      case 'negative': return 'error';
      default: return 'info';
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'simple': return 'success';
      case 'complex': return 'error';
      default: return 'warning';
    }
  };

  const exampleTexts = [
    "I absolutely love this new technology! It's revolutionary and will change everything.",
    "The weather forecast indicates potential precipitation with overcast conditions.",
    "Hey there! What's up? Wanna grab some coffee later?",
    "In conclusion, the empirical evidence suggests a statistically significant correlation between the variables examined in this comprehensive study.",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Grid container spacing={3}>
        {/* Input Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Text Analysis
            </Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={10}>
                                 <TextField
                   fullWidth
                   multiline
                   rows={4}
                   value={inputText}
                   onChange={(e) => setInputText(e.target.value)}
                   placeholder="Enter text to analyze for tone, style, complexity, and language..."
                   variant="outlined"
                   InputProps={{
                     sx: {
                       overflow: 'auto',
                       wordBreak: 'break-word',
                       whiteSpace: 'pre-wrap'
                     }
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
              </Grid>
              <Grid item xs={12} md={2}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleAnalyze}
                  disabled={loading || !inputText.trim()}
                  startIcon={loading ? <CircularProgress size={20} /> : <AnalyticsRounded />}
                  sx={{ height: '56px' }}
                >
                  {loading ? 'Analyzing...' : 'Analyze'}
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Analysis Results */}
        {analysis && (
          <>
            {/* Language Detection */}
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <LanguageRounded color="primary" />
                      <Typography variant="h6">Language Detection</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="primary" gutterBottom>
                        {analysis.language_name}
                      </Typography>
                      <Chip 
                        label={`Code: ${analysis.detected_language.toUpperCase()}`} 
                        variant="outlined" 
                      />
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            {/* Quick Stats */}
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <TextFieldsRounded color="primary" />
                      <Typography variant="h6">Text Statistics</Typography>
                    </Box>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Characters
                        </Typography>
                        <Typography variant="h6">
                          {inputText.length}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Words
                        </Typography>
                        <Typography variant="h6">
                          {inputText.trim().split(/\s+/).length}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Sentences
                        </Typography>
                        <Typography variant="h6">
                          {inputText.split(/[.!?]+/).filter(s => s.trim().length > 0).length}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Avg. Word Length
                        </Typography>
                        <Typography variant="h6">
                          {Math.round(inputText.replace(/[^\w]/g, '').length / inputText.trim().split(/\s+/).length * 10) / 10}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            {/* AI Analysis */}
            <Grid item xs={12}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <TrendingUpRounded color="primary" />
                      <Typography variant="h6">AI Analysis</Typography>
                    </Box>
                    
                    {typeof analysis.analysis === 'string' ? (
                      <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                          {analysis.analysis}
                        </Typography>
                      </Paper>
                    ) : (
                      <Grid container spacing={2}>
                        {/* Tone */}
                        {analysis.analysis.tone && (
                          <Grid item xs={12} md={4}>
                            <Box sx={{ textAlign: 'center', p: 1 }}>
                              <Typography variant="subtitle2" color="text.secondary">
                                Tone
                              </Typography>
                              <Chip 
                                label={analysis.analysis.tone} 
                                color="primary"
                                sx={{ mt: 1 }}
                              />
                            </Box>
                          </Grid>
                        )}

                        {/* Style */}
                        {analysis.analysis.style && (
                          <Grid item xs={12} md={4}>
                            <Box sx={{ textAlign: 'center', p: 1 }}>
                              <Typography variant="subtitle2" color="text.secondary">
                                Style
                              </Typography>
                              <Chip 
                                label={analysis.analysis.style} 
                                color="secondary"
                                sx={{ mt: 1 }}
                              />
                            </Box>
                          </Grid>
                        )}

                        {/* Emotion */}
                        {analysis.analysis.emotion && (
                          <Grid item xs={12} md={4}>
                            <Box sx={{ textAlign: 'center', p: 1 }}>
                              <Typography variant="subtitle2" color="text.secondary">
                                Sentiment
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mt: 1 }}>
                                {getSentimentIcon(analysis.analysis.emotion)}
                                <Chip 
                                  label={analysis.analysis.emotion} 
                                  color={getSentimentColor(analysis.analysis.emotion) as any}
                                />
                              </Box>
                            </Box>
                          </Grid>
                        )}

                        {/* Complexity */}
                        {analysis.analysis.complexity && (
                          <Grid item xs={12} md={6}>
                            <Box sx={{ p: 1 }}>
                              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                Complexity
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <LinearProgress 
                                  variant="determinate" 
                                  value={
                                    analysis.analysis.complexity === 'simple' ? 33 :
                                    analysis.analysis.complexity === 'moderate' ? 66 : 100
                                  }
                                  sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                                  color={getComplexityColor(analysis.analysis.complexity) as any}
                                />
                                <Chip 
                                  label={analysis.analysis.complexity} 
                                  size="small"
                                  color={getComplexityColor(analysis.analysis.complexity) as any}
                                />
                              </Box>
                            </Box>
                          </Grid>
                        )}

                        {/* Formality Level */}
                        {analysis.analysis.formality_level && (
                          <Grid item xs={12} md={6}>
                            <Box sx={{ p: 1 }}>
                              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                Formality Level
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <LinearProgress 
                                  variant="determinate" 
                                  value={analysis.analysis.formality_level * 10}
                                  sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                                />
                                <Chip 
                                  label={`${analysis.analysis.formality_level}/10`} 
                                  size="small"
                                />
                              </Box>
                            </Box>
                          </Grid>
                        )}

                        {/* Cultural Context */}
                        {analysis.analysis.cultural_context && (
                          <Grid item xs={12}>
                            <Box sx={{ p: 1 }}>
                              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                Cultural Context
                              </Typography>
                              <Typography variant="body2">
                                {analysis.analysis.cultural_context}
                              </Typography>
                            </Box>
                          </Grid>
                        )}
                      </Grid>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </>
        )}

        {/* Example Texts */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Try Analyzing These Examples:
            </Typography>
            <Grid container spacing={1}>
              {exampleTexts.map((example, index) => (
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
                    onClick={() => setInputText(example)}
                  >
                    <Typography variant="body2" color="text.secondary">
                      "{example}"
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Analysis Guide */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              What We Analyze
            </Typography>
            <Grid container spacing={2}>
                             <Grid item xs={12} md={3}>
                 <Box sx={{ textAlign: 'center', p: 1 }}>
                   <LanguageRounded sx={{ fontSize: 40, mb: 1, color: '#667eea' }} />
                   <Typography variant="subtitle2">Language Detection</Typography>
                   <Typography variant="body2" color="text.secondary">
                     Automatically identify the language of your text
                   </Typography>
                 </Box>
               </Grid>
               <Grid item xs={12} md={3}>
                 <Box sx={{ textAlign: 'center', p: 1 }}>
                   <SentimentSatisfiedRounded sx={{ fontSize: 40, mb: 1, color: '#4ade80' }} />
                   <Typography variant="subtitle2">Sentiment Analysis</Typography>
                   <Typography variant="body2" color="text.secondary">
                     Determine if the text is positive, negative, or neutral
                   </Typography>
                 </Box>
               </Grid>
               <Grid item xs={12} md={3}>
                 <Box sx={{ textAlign: 'center', p: 1 }}>
                   <TextFieldsRounded sx={{ fontSize: 40, mb: 1, color: '#fbbf24' }} />
                   <Typography variant="subtitle2">Style Analysis</Typography>
                   <Typography variant="body2" color="text.secondary">
                     Identify writing style, tone, and formality level
                   </Typography>
                 </Box>
               </Grid>
               <Grid item xs={12} md={3}>
                 <Box sx={{ textAlign: 'center', p: 1 }}>
                   <TrendingUpRounded sx={{ fontSize: 40, mb: 1, color: '#a855f7' }} />
                   <Typography variant="subtitle2">Complexity Analysis</Typography>
                   <Typography variant="body2" color="text.secondary">
                     Assess text complexity and readability
                   </Typography>
                 </Box>
               </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </motion.div>
  );
};

export default AnalyzeTab;
