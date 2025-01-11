import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskForm from './TaskForm';
import { ThemeProvider } from '@/layouts/themeProvider/ThemeProvider'; // Remplacez par le chemin réel

const renderWithProviders = (ui, { providerProps, ...renderOptions } = {}) => {
  return render(
    <ThemeProvider {...providerProps}>{ui}</ThemeProvider>,
    renderOptions
  );
};

describe('TaskForm', () => {
  const mockOnSubmit = vi.fn();

  it('On vérifie que le formulaire est bien rendu', () => {
    renderWithProviders(<TaskForm onSubmit={mockOnSubmit} />);

    // On vérifie les champs du formulaire
    expect(screen.getByLabelText(/titre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ajouter la tâche/i })).toBeInTheDocument();
  });

  it('On vérifie les erreurs losque l\'on transmet des champs vide', async () => {
    renderWithProviders(<TaskForm onSubmit={mockOnSubmit} />);

    // On soumet le formulaire sans remplir les champs
    fireEvent.click(screen.getByRole('button', { name: /ajouter la tâche/i }));

    // On vérifie les messages d'erreur
    expect(await screen.findByText(/le titre est obligatoire/i)).toBeInTheDocument();
    expect(await screen.findByText(/la description est obligatoire/i)).toBeInTheDocument();
  });

  it('On vérifie la data envoyée lorsque le formulaire est valide', async () => {
    renderWithProviders(<TaskForm onSubmit={mockOnSubmit} />);

    // On rempli les champs du formulaire dans un bloc `act`
    await act(async () => {
      fireEvent.change(screen.getByLabelText(/titre/i), {
        target: { value: 'Test Task' },
      });
      fireEvent.change(screen.getByLabelText(/description/i), {
        target: { value: 'Test Description' },
      });

      fireEvent.click(
        screen.getByRole('button', { name: /ajouter la tâche/i })
      );
    });

    // On vérifie que la fonction onSubmit a été appelée avec les bonnes données
    expect(mockOnSubmit).toHaveBeenCalledWith({
      title: 'Test Task',
      description: 'Test Description',
    });
    expect(mockOnSubmit).toHaveBeenCalledTimes(1); // On vérifie que le mock a bien été appelé une fois
  });
});
