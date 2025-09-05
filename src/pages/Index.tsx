import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Mic, BarChart3, Play } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-6">
            AI Interview Platform
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Experience next-generation interviews with our AI-powered platform. 
            Get real-time feedback, detailed analysis, and improve your interview skills.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => window.location.href = "/interview"}
              size="lg"
              className="bg-gradient-primary hover:opacity-90 transition-opacity shadow-glow text-lg px-8 py-4"
            >
              <Play className="h-6 w-6 mr-2" />
              Start Interview
            </Button>
            <Button
              onClick={() => window.location.href = "/results"}
              variant="outline"
              size="lg" 
              className="border-primary/50 hover:bg-primary/10 text-lg px-8 py-4"
            >
              <BarChart3 className="h-6 w-6 mr-2" />
              View Results
            </Button>
          </div>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-8 bg-gradient-card border-primary/20 text-center h-full">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mic className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Real-time Recording</h3>
              <p className="text-muted-foreground">
                Advanced audio and video recording with seamless integration. 
                Practice with our intelligent AI interviewer.
              </p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-8 bg-gradient-card border-success/20 text-center h-full">
              <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <BarChart3 className="h-8 w-8 text-success" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Detailed Analytics</h3>
              <p className="text-muted-foreground">
                Get comprehensive feedback with scoring, strengths analysis, 
                and personalized improvement suggestions.
              </p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-8 bg-gradient-card border-interview-accent/20 text-center h-full">
              <div className="w-16 h-16 bg-interview-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <ArrowRight className="h-8 w-8 text-interview-accent" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Smart Progression</h3>
              <p className="text-muted-foreground">
                Dynamic question flow that adapts to your responses. 
                Professional interview simulation experience.
              </p>
            </Card>
          </motion.div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <Card className="p-12 bg-gradient-primary/10 border-primary/30">
            <h2 className="text-3xl font-bold mb-4">Ready to ace your next interview?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who have improved their interview skills with our AI platform.
            </p>
            <Button
              onClick={() => window.location.href = "/interview"}
              size="lg"
              className="bg-gradient-primary hover:opacity-90 transition-opacity shadow-glow text-lg px-12 py-4"
            >
              Get Started Now
              <ArrowRight className="h-6 w-6 ml-2" />
            </Button>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
