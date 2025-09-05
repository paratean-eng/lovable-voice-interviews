import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Trophy, TrendingUp, TrendingDown, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface InterviewResult {
  question: string;
  answer: string;
  score: number;
  audio_file?: string;
}

interface ResultsData {
  results: InterviewResult[];
  average_score?: number;
  strengths?: string[];
  weaknesses?: string[];
}

const Results = () => {
  const [data, setData] = useState<ResultsData>({ results: [] });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const response = await fetch("http://localhost:8000/results");
      const resultsData = await response.json();
      
      // Calculate average score if not provided
      const avgScore = resultsData.average_score || 
        (resultsData.results.length > 0 
          ? resultsData.results.reduce((sum: number, r: InterviewResult) => sum + r.score, 0) / resultsData.results.length
          : 0);
      
      setData({
        ...resultsData,
        average_score: avgScore
      });
    } catch (error) {
      console.error("Error fetching results:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load results. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "bg-success text-success-foreground";
    if (score >= 6) return "bg-warning text-warning-foreground";
    return "bg-destructive text-destructive-foreground";
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 8) return "default";
    if (score >= 6) return "secondary";
    return "destructive";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => window.location.href = "/interview"}
            className="mb-4 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Interview
          </Button>
          
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
            Interview Results
          </h1>
          <p className="text-muted-foreground text-lg">
            Your performance summary and detailed feedback
          </p>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 bg-gradient-card border-primary/20 text-center">
              <Trophy className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-primary mb-2">
                {data.average_score?.toFixed(1) || "0.0"}
              </h3>
              <p className="text-muted-foreground">Average Score</p>
              <Progress 
                value={(data.average_score || 0) * 10} 
                className="mt-3"
              />
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6 bg-gradient-card border-success/20 text-center">
              <BarChart3 className="h-12 w-12 text-success mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-success mb-2">
                {data.results.length}
              </h3>
              <p className="text-muted-foreground">Questions Completed</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="p-6 bg-gradient-card border-interview-accent/20 text-center">
              <TrendingUp className="h-12 w-12 text-interview-accent mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-interview-accent mb-2">
                {data.results.filter(r => r.score >= 7).length}
              </h3>
              <p className="text-muted-foreground">Strong Responses</p>
            </Card>
          </motion.div>
        </div>

        {/* Strengths & Weaknesses */}
        {(data.strengths?.length || data.weaknesses?.length) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {data.strengths && data.strengths.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Card className="p-6 bg-gradient-success/10 border-success/20">
                  <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="h-6 w-6 text-success" />
                    <h3 className="text-xl font-semibold text-success">Strengths</h3>
                  </div>
                  <ul className="space-y-2">
                    {data.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0" />
                        <span className="text-foreground">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            )}

            {data.weaknesses && data.weaknesses.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Card className="p-6 bg-destructive/10 border-destructive/20">
                  <div className="flex items-center gap-3 mb-4">
                    <TrendingDown className="h-6 w-6 text-destructive" />
                    <h3 className="text-xl font-semibold text-destructive">Areas for Improvement</h3>
                  </div>
                  <ul className="space-y-2">
                    {data.weaknesses.map((weakness, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0" />
                        <span className="text-foreground">{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            )}
          </div>
        )}

        {/* Detailed Results */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="p-6 bg-gradient-card border-primary/20">
            <h2 className="text-2xl font-semibold mb-6">Detailed Response Analysis</h2>
            
            {data.results.length === 0 ? (
              <div className="text-center py-12">
                <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                  No Results Available
                </h3>
                <p className="text-muted-foreground">
                  Complete an interview to see your results here.
                </p>
                <Button
                  onClick={() => window.location.href = "/interview"}
                  className="mt-4 bg-gradient-primary"
                >
                  Start Interview
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {data.results.map((result, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                    className="border border-border rounded-lg p-6 bg-card/50"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-medium flex-1">
                        Question {index + 1}
                      </h3>
                      <Badge 
                        variant={getScoreBadgeVariant(result.score)}
                        className={`${getScoreColor(result.score)} ml-4`}
                      >
                        {result.score}/10
                      </Badge>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-interview-accent mb-2">Question:</h4>
                        <p className="text-foreground bg-muted p-3 rounded-md">
                          {result.question}
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-success mb-2">Your Response:</h4>
                        <p className="text-foreground bg-muted p-3 rounded-md">
                          {result.answer}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={result.score * 10} 
                          className="flex-1"
                        />
                        <span className="text-sm font-medium">
                          {result.score}/10
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="flex justify-center gap-4 mt-8"
        >
          <Button
            onClick={() => window.location.href = "/interview"}
            className="bg-gradient-primary hover:opacity-90 transition-opacity"
          >
            Take New Interview
          </Button>
          <Button
            variant="outline"
            onClick={fetchResults}
            className="border-primary/50 hover:bg-primary/10"
          >
            Refresh Results
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Results;