import {
  getAttributeOrThrow,
  getElementOrThrow,
  getLocalStorageOrThrow,
} from "safe-query";
import "./initializeDarkMode";

const html = /*html*/ `
    <style>
        .switch {
        position: relative;
        display: flex;
        width: 4rem;
        height: 2rem;
        place-items: center;
    }

    .switch .toggle {
        position: absolute;
        opacity: 0;
        width: 0;
        height: 0;
    }

    .slider {
        position: absolute;
        display: block;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc; 
        transition: .4s;
        border-radius: 2rem;
    }

    .dark p {
        position: relative;
        transition: .4s;
        border-radius: 50%;
    }

    input:checked ~ .slider {
        background-color: #2196F3;
    }

    input:focus ~ .slider {
        box-shadow: 0 0 1px #2196F3; 
        }

    input:checked ~ p {
        transform: translateX(2rem); 
    }

    .dark {
        position: relative;
        font-size: 1.3rem;
        opacity:  85%;
    }

    p {
        user-select: none;
        -moz-user-select: none;
        -webkit-user-drag: none;
        -webkit-user-select: none;
        -ms-user-select: none;
    }

    </style>
    <div class="dark">
        <label class="switch">
            <input type="checkbox" class="toggle">
            <span class="slider round"></span>
            <p></p>
        </label>
    </div>
        `;
class DarkModeToggle extends HTMLElement {
  public link!: string;
  public toggleableImages!: NodeListOf<HTMLImageElement>;

  /**
   * Constructs the DarkModeToggle custom element, attaching a shadow DOM and rendering its initial content.
   */
  public constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.render();
  }
  /**
   * Renders the HTML content of the DarkModeToggle element within its shadow DOM, including styles and structure for the dark mode toggle switch.
   */
  private render(): void {
    this.shadowRoot!.innerHTML = html;
  }

  /**
   * Lifecycle callback invoked when the element is inserted into the DOM. It initializes dark mode based on saved preferences and sets up event listeners.
   */
  public connectedCallback(): void {


    window.addEventListener("DOMContentLoaded", () => {
      this.initializeDarkMode();
      this.addEventListeners()
    })
  }
  /**
   * Initializes the dark mode state based on the user's saved theme preference in localStorage or system preference if not set.
   */
  private initializeDarkMode(): void {
    const noExistingTheme = localStorage.getItem("theme");
    const toggle = getElementOrThrow(
      this.shadowRoot!,
      ".toggle",
    ) as HTMLInputElement;

    if (!noExistingTheme) {
      this.initiateLocalStorage();
    }

    const currentTheme = getLocalStorageOrThrow("theme")!;
    if (currentTheme === "dark") {
      document.documentElement.classList.add("dark-theme");
      toggle.checked = true;
    } else {
      document.documentElement.classList.remove("dark-theme");
      toggle.checked = false;
    }
    this.setSymbol(toggle.checked);

    this.toggleableImages = document.querySelectorAll<HTMLImageElement>(".dark-toggle");
    this.toggleableImages.forEach((img) => this.initializeImage(img));
  }

  /**
   * Sets the initial theme in localStorage based on the user's system preference if no theme has previously been set.
   */
  private initiateLocalStorage() {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      localStorage.setItem("theme", "dark");
    } else {
      localStorage.setItem("theme", "light");
    }
  }

  /**
   * Adds event listeners to the dark mode toggle switch, enabling users to change the theme.
   */
  private addEventListeners(): void {
    const toggle = getElementOrThrow(
      this.shadowRoot!,
      ".toggle",
    ) as HTMLInputElement;
    toggle.addEventListener("click", (e) => {
      // This is necessary to unsure clicking the button doesn't trigger dark mode more than once.
      e.stopPropagation();
      this.handleDarkModeToggle(toggle.checked);
      this.toggleableImages.forEach((img) => this.toggleImage(img));
    });
  }

  /**
   * Handles the toggle action, updating the document's class list and localStorage with the new theme preference and updating the toggle symbol.
   * @param isDarkMode A boolean indicating whether dark mode is enabled or not.
   */
  private handleDarkModeToggle(isDarkMode: boolean): void {
    this.setSymbol(isDarkMode);

    document.documentElement.classList.toggle("dark-theme", isDarkMode);
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }

  /**
   * Sets the symbol displayed by the toggle switch based on the current theme mode.
   * @param isDarkMode A boolean indicating whether dark mode is enabled or not, determining the symbol to display.
   */
  private setSymbol(isDarkMode: boolean) {
    const symbol = getElementOrThrow(this.shadowRoot!, "p");
    symbol.innerHTML = isDarkMode ? "🌒" : "☀️";
  }

  /**
   * Initializes an image for dark mode, toggling its source if the current theme is dark.
   * @param image The HTMLImageElement to be initialized for dark mode.
   */
  private initializeImage(image: HTMLImageElement) {
    const currentTheme = getLocalStorageOrThrow("theme");
    if (currentTheme === "dark") {
      this.toggleImage(image);
    }
  }

  /**
   * Toggles an image source between its default and alternate (dark mode) versions.
   * @param image The HTMLImageElement whose source will be toggled.
   */
  private toggleImage(image: HTMLImageElement) {
    const imageAlt = getAttributeOrThrow(image, "data-alt-src");
    image.setAttribute("data-alt-src", image.src);
    image.src = imageAlt;
  }
}

customElements.define("dark-mode-toggle", DarkModeToggle);
