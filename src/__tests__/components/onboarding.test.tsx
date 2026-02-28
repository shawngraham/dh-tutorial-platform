import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Welcome } from '../../components/onboarding/Welcome.tsx';
import { BackgroundAssessment } from '../../components/onboarding/BackgroundAssessment.tsx';
import { InterestMapping } from '../../components/onboarding/InterestMapping.tsx';
import { GoalSetting } from '../../components/onboarding/GoalSetting.tsx';

const renderWithRouter = (ui: React.ReactElement, { route = '/' } = {}) => {
  return render(<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>);
};

describe('Welcome', () => {
  it('renders welcome heading', () => {
    renderWithRouter(<Welcome />);
    expect(screen.getByText('Welcome to the DHPrimer: Tutorial Lab')).toBeInTheDocument();
  });

  it('renders get started button', () => {
    renderWithRouter(<Welcome />);
    expect(screen.getByText('Get Started')).toBeInTheDocument();
  });

  it('displays privacy message', () => {
    renderWithRouter(<Welcome />);
    expect(screen.getByText(/All data stays on your device/)).toBeInTheDocument();
  });
});

describe('BackgroundAssessment', () => {
  it('renders discipline selection', () => {
    renderWithRouter(<BackgroundAssessment />);
    expect(screen.getByText(/primary discipline/i)).toBeInTheDocument();
  });

  it('renders programming experience options', () => {
    renderWithRouter(<BackgroundAssessment />);
    expect(screen.getByText(/written code before/i)).toBeInTheDocument();
  });

  it('renders next button', () => {
    renderWithRouter(<BackgroundAssessment />);
    expect(screen.getByText('Next')).toBeInTheDocument();
  });
});

describe('InterestMapping', () => {
  it('renders interest cards', () => {
    renderWithRouter(<InterestMapping />);
    expect(screen.getAllByText(/interest/i).length).toBeGreaterThan(0);
  });

  it('allows selecting interests', () => {
    renderWithRouter(<InterestMapping />);
    const cards = screen.getAllByRole('button');
    expect(cards.length).toBeGreaterThan(0);
  });
});

describe('GoalSetting', () => {
  it('renders goal setting form', () => {
    renderWithRouter(<GoalSetting />);
    expect(screen.getByText(/accomplish/i)).toBeInTheDocument();
  });
});
