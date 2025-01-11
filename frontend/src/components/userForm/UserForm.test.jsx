import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import UserForm from "./UserForm";
import { ThemeProvider } from "@/layouts/themeProvider/ThemeProvider";

const renderWithProviders = (ui, { providerProps, ...renderOptions } = {}) => {
  return render(
    <ThemeProvider {...providerProps}>{ui}</ThemeProvider>,
    renderOptions
  );
};

describe("UserForm", () => {
  const mockOnSubmit = vi.fn();
  const currentUserRoles = ["ROLE_SUPERADMIN"];

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it("On vérifie que le formulaire est bien rendu", () => {
    renderWithProviders(
      <UserForm onSubmit={mockOnSubmit} currentUserRoles={currentUserRoles} />
    );

    expect(screen.getByLabelText(/nom d'utilisateur/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/rôles/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /ajouter l'utilisateur/i })
    ).toBeInTheDocument();
  });

  it("On vérifie les erreurs lorsque les champs requis sont vides", async () => {
    renderWithProviders(
      <UserForm onSubmit={mockOnSubmit} currentUserRoles={currentUserRoles} />
    );

    fireEvent.click(
      screen.getByRole("button", { name: /ajouter l'utilisateur/i })
    );

    expect(
      await screen.findByText(/le nom d'utilisateur est obligatoire/i)
    ).toBeInTheDocument();
    expect(await screen.findByText(/l'email est obligatoire/i)).toBeInTheDocument();
    expect(
      await screen.findByText(/le mot de passe est obligatoire/i)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/veuillez sélectionner au moins un rôle/i)
    ).toBeInTheDocument();
  });

  it("On vérifie que les données sont envoyées correctement lors de l'ajout d'un nouvel utilisateur", async () => {
    renderWithProviders(
      <UserForm onSubmit={mockOnSubmit} currentUserRoles={currentUserRoles} />
    );

    await act(async () => {
      fireEvent.change(screen.getByLabelText(/nom d'utilisateur/i), {
        target: { value: "NewUser" },
      });
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: "newuser@example.com" },
      });
      fireEvent.change(screen.getByLabelText(/mot de passe/i), {
        target: { value: "Password@123" },
      });

      const rolesSelect = screen.getByLabelText(/rôles/i);
      fireEvent.change(rolesSelect, { target: { value: "ROLE_USER" } });
      for (const option of rolesSelect.options) {
        if (option.value === "ROLE_USER") {
          option.selected = true;
        }
      }
      fireEvent.change(rolesSelect);

      fireEvent.click(
        screen.getByRole("button", { name: /ajouter l'utilisateur/i })
      );
    });

    expect(mockOnSubmit).toHaveBeenCalledWith({
      username: "NewUser",
      email: "newuser@example.com",
      password: "Password@123",
      roles: ["ROLE_USER"],
    });
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
  });

  it("On vérifie les données envoyées lors de la modification d'un utilisateur existant", async () => {
    const defaultValues = {
      id: 1,
      username: "ExistingUser",
      email: "existing@example.com",
      roles: "ROLE_ADMIN",
    };

    renderWithProviders(
      <UserForm
        defaultValues={defaultValues}
        onSubmit={mockOnSubmit}
        currentUserRoles={currentUserRoles}
      />
    );

    await act(async () => {
      fireEvent.change(screen.getByLabelText(/nom d'utilisateur/i), {
        target: { value: "UpdatedUser" },
      });
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: "updated@example.com" },
      });

      const rolesSelect = screen.getByLabelText(/rôles/i);
      fireEvent.change(rolesSelect, { target: { value: "ROLE_SUPERADMIN" } });
      for (const option of rolesSelect.options) {
        if (option.value === "ROLE_SUPERADMIN") {
          option.selected = true;
        }
      }
      fireEvent.change(rolesSelect);

      fireEvent.click(
        screen.getByRole("button", { name: /modifier l'utilisateur/i })
      );
    });

    expect(mockOnSubmit).toHaveBeenCalledWith({
      id: 1,
      username: "UpdatedUser",
      email: "updated@example.com",
      password: "",
      roles: ["ROLE_SUPERADMIN"],
    });
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
  });
});
