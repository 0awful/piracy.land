import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoadingScreen from './LoadingScreen';

jest.mock('lucide-react', () => ({
  Terminal: () => <div data-testid="terminal-icon">Terminal Icon</div>
}));

describe('LoadingScreen', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('displays the current tip', () => {
    render(<LoadingScreen tips={["Single test tip"]} />);
    
    // Check the visible tip (opacity 100)
    const visibleTip = screen.getByText("Single test tip", { 
      selector: '.opacity-100 span' 
    });
    expect(visibleTip).toBeInTheDocument();
  });

  it('cycles between two tips', () => {
    const tips = ["First tip", "Second tip"];
    render(<LoadingScreen tips={tips} tipInterval={3000} />);
    
    // Initially first tip is visible
    const initialTip = screen.getByText(tips[0], { 
      selector: '.opacity-100 span'
    });
    expect(initialTip).toBeInTheDocument();
    
    // After time passes, second tip becomes visible
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    
    const nextTip = screen.getByText(tips[1], { 
      selector: '.opacity-100 span'
    });
    expect(nextTip).toBeInTheDocument();
  });

  it('shows and hides a single log message', async () => {
    const testLog = { type: 'info', message: 'Test message' };
    render(<LoadingScreen logs={[testLog]} />);
    
    // Initially console is translated off screen
    const consoleWindow = screen.getByTestId('console-window');
    expect(consoleWindow).toHaveClass('translate-y-full');
    
    // Open console
    fireEvent.mouseDown(screen.getByTestId('console-toggle'));
    
    // Verify console is visible on screen
    expect(consoleWindow).toHaveClass('translate-y-0');
    expect(screen.getByText(testLog.message)).toBeVisible();
    
    // Close console
    fireEvent.mouseDown(screen.getByTestId('console-overlay'));
    
    // Verify console is hidden off screen again
    expect(consoleWindow).toHaveClass('translate-y-full');
}); 

  it('can hide spinner and tips', () => {
    render(<LoadingScreen 
      showSpinner={false} 
      showTips={false}
      tips={["Test tip"]}
    />);
    
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    expect(screen.queryByText("Test tip")).not.toBeInTheDocument();
    expect(screen.getByTestId('console-toggle')).toBeInTheDocument();
  });
});
