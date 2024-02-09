import { getElementOrThrow } from "safe-query";
import { describe, beforeEach, afterEach, test, expect, vi } from "vitest";
import "./index.ts"; // We need to import this to run customElements.define()

describe("DarkModeToggle Component", () => {
  beforeEach(() => {
    // @ts-ignore
    // Monkey match matchMedia so we can manipulate it for our tests
    window.matchMedia = vi.fn((query) => ({}));
  });

  afterEach(() => {
    document.body.innerHTML = "";
    vi.resetAllMocks();
    localStorage.clear();
  });

  test("initializes dark mode based on system preference", () => {
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: query === "(prefers-color-scheme: dark)",
    })) as (query: string) => MediaQueryList;

    document.body.innerHTML = "<dark-mode-toggle></dark-mode-toggle>";
    const component = getElementOrThrow(document, "dark-mode-toggle");

    const toggle = getElementOrThrow<HTMLInputElement>(
      component.shadowRoot!,
      ".toggle",
    );
    expect(toggle.checked).toBe(
      window.matchMedia("(prefers-color-scheme: dark)").matches,
    );
  });

  test("toggles dark mode on click", () => {
    document.body.innerHTML = "<dark-mode-toggle></dark-mode-toggle>";
    const component = getElementOrThrow(document, "dark-mode-toggle");

    const toggle = getElementOrThrow<HTMLInputElement>(
      component.shadowRoot!,
      ".toggle",
    );
    const initialCheckedState = toggle.checked;
    toggle.click();

    expect(toggle.checked).toBe(!initialCheckedState);
    expect(document.documentElement.classList.contains("dark-theme")).toBe(
      !initialCheckedState,
    );
    expect(localStorage.getItem("theme")).toBe(
      !initialCheckedState ? "dark" : "light",
    );
  });

  test("initializes dark mode based on localStorage preference", () => {
    localStorage.setItem("theme", "dark");
    document.body.innerHTML = "<dark-mode-toggle></dark-mode-toggle>";

    const component = getElementOrThrow(document, "dark-mode-toggle");
    const toggle = getElementOrThrow<HTMLInputElement>(
      component.shadowRoot!,
      ".toggle",
    );

    expect(toggle.checked).toBe(true);
  });
});
