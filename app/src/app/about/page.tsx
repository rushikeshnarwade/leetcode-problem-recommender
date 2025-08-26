'use client';

import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-backgroundSecondary to-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-textPrimary mb-6 font-code">
            &lt;/About <span className="text-accent-cyan">This App</span>&gt;
          </h1>
          <p className="text-xl text-textSecondary max-w-2xl mx-auto leading-relaxed">
            A comprehensive LeetCode problem recommendation system designed to help developers 
            enhance their coding skills through personalized problem suggestions.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="glass-elevated p-6 rounded-xl border border-border/50 hover:border-accent-cyan/30 transition-all duration-300">
            <div className="text-accent-blue text-2xl mb-4">🎯</div>
            <h3 className="text-lg font-semibold text-textPrimary mb-2">Smart Recommendations</h3>
            <p className="text-textSecondary text-sm">
              Get personalized problem suggestions based on your skill level and progress.
            </p>
          </div>

          <div className="glass-elevated p-6 rounded-xl border border-border/50 hover:border-accent-cyan/30 transition-all duration-300">
            <div className="text-accent-green text-2xl mb-4">📊</div>
            <h3 className="text-lg font-semibold text-textPrimary mb-2">Progress Tracking</h3>
            <p className="text-textSecondary text-sm">
              Monitor your coding journey with detailed statistics and performance metrics.
            </p>
          </div>

          <div className="glass-elevated p-6 rounded-xl border border-border/50 hover:border-accent-cyan/30 transition-all duration-300">
            <div className="text-accent-yellow text-2xl mb-4">🏆</div>
            <h3 className="text-lg font-semibold text-textPrimary mb-2">Contest Integration</h3>
            <p className="text-textSecondary text-sm">
              View your LeetCode contest performance and rankings all in one place.
            </p>
          </div>

          <div className="glass-elevated p-6 rounded-xl border border-border/50 hover:border-accent-cyan/30 transition-all duration-300">
            <div className="text-accent-purple text-2xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-textPrimary mb-2">Advanced Filtering</h3>
            <p className="text-textSecondary text-sm">
              Filter problems by difficulty, topics, companies, and completion status.
            </p>
          </div>

          <div className="glass-elevated p-6 rounded-xl border border-border/50 hover:border-accent-cyan/30 transition-all duration-300">
            <div className="text-accent-red text-2xl mb-4">⚡</div>
            <h3 className="text-lg font-semibold text-textPrimary mb-2">Real-time Sync</h3>
            <p className="text-textSecondary text-sm">
              Stay updated with the latest problems and your LeetCode progress automatically.
            </p>
          </div>

          <div className="glass-elevated p-6 rounded-xl border border-border/50 hover:border-accent-cyan/30 transition-all duration-300">
            <div className="text-accent-orange text-2xl mb-4">🎨</div>
            <h3 className="text-lg font-semibold text-textPrimary mb-2">Clean Interface</h3>
            <p className="text-textSecondary text-sm">
              Enjoy a modern, distraction-free interface designed for focused learning.
            </p>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="glass-elevated p-8 rounded-xl border border-border/50 mb-16">
          <h2 className="text-2xl font-bold text-textPrimary mb-8 text-center">
            Platform Statistics
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-accent-cyan mb-2">3,661</div>
              <div className="text-textSecondary text-sm">Total Problems</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent-green mb-2">891</div>
              <div className="text-textSecondary text-sm">Easy Problems</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent-yellow mb-2">1,907</div>
              <div className="text-textSecondary text-sm">Medium Problems</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent-red mb-2">863</div>
              <div className="text-textSecondary text-sm">Hard Problems</div>
            </div>
          </div>
        </div>

        {/* Technology Stack */}
        <div className="glass-elevated p-8 rounded-xl border border-border/50 mb-16">
          <h2 className="text-2xl font-bold text-textPrimary mb-8 text-center">
            Built With Modern Technologies
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              { name: 'Next.js', icon: '⚛️' },
              { name: 'React', icon: '🔵' },
              { name: 'TypeScript', icon: '📘' },
              { name: 'Firebase', icon: '🔥' },
              { name: 'Tailwind CSS', icon: '🎨' },
              { name: 'GraphQL', icon: '📊' },
              { name: 'Firestore', icon: '💾' },
              { name: 'Vercel', icon: '▲' }
            ].map((tech, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-backgroundSecondary/50 transition-colors">
                <span className="text-xl">{tech.icon}</span>
                <span className="text-textSecondary font-medium">{tech.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Mission Statement */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-textPrimary mb-6">Our Mission</h2>
          <p className="text-textSecondary text-lg max-w-3xl mx-auto leading-relaxed">
            To create the most intuitive and effective platform for developers to improve their 
            problem-solving skills. We believe that with the right guidance and tools, every 
            developer can achieve their coding goals and excel in technical interviews.
          </p>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="glass-elevated p-8 rounded-xl border border-border/50 hover:border-accent-cyan/30 transition-all duration-300">
            <h3 className="text-2xl font-bold text-textPrimary mb-4">Ready to Level Up?</h3>
            <p className="text-textSecondary mb-6">
              Join thousands of developers who are improving their coding skills daily.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/"
                className="btn-primary inline-flex items-center justify-center"
              >
                Start Solving Problems
              </a>
              <a 
                href="/profile"
                className="btn-secondary inline-flex items-center justify-center"
              >
                View Your Profile
              </a>
            </div>
          </div>
        </div>

        {/* Developer Section */}
        <div className="glass-elevated p-8 rounded-xl border border-border/50 mb-16">
          <h2 className="text-2xl font-bold text-textPrimary mb-8 text-center">
            About the Developer
          </h2>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-32 h-32 bg-gradient-to-br from-accent-cyan to-accent-blue rounded-full flex items-center justify-center text-4xl font-bold text-white">
              R
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-bold text-textPrimary mb-2">Rushikesh</h3>
              <p className="text-textSecondary mb-4 leading-relaxed">
                A passionate full-stack developer dedicated to creating tools that help fellow developers 
                grow and succeed. With expertise in modern web technologies and a deep understanding of 
                the challenges developers face in technical interviews, I built this platform to make 
                LeetCode practice more organized and effective.
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <span className="px-3 py-1 bg-accent-cyan/10 text-accent-cyan rounded-full text-sm font-medium">
                  React Developer
                </span>
                <span className="px-3 py-1 bg-accent-blue/10 text-accent-blue rounded-full text-sm font-medium">
                  Full Stack Engineer
                </span>
                <span className="px-3 py-1 bg-accent-purple/10 text-accent-purple rounded-full text-sm font-medium">
                  Problem Solver
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-16 pt-8 border-t border-border/30">
          <p className="text-textSecondary text-sm">
            This application is not affiliated with LeetCode. All problem data is sourced from 
            publicly available APIs and is used for educational purposes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;