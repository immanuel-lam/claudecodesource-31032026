import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

// Types
export type RenderOptions = {};
export type Instance = {
  unmount: () => void;
  waitUntilExit: () => Promise<void>;
  cleanup: () => void;
};
export type Root = {
  render: (node: ReactNode) => void;
  unmount: () => void;
  waitUntilExit: () => Promise<void>;
};

// Shims for Ink components
export const Box = ({ children, style, ...props }: any) => {
  const webStyle = {
    display: 'flex',
    flexDirection: props.flexDirection || 'row',
    flexGrow: props.flexGrow || 0,
    flexShrink: props.flexShrink || 1,
    paddingTop: props.paddingTop || props.paddingY || props.padding || 0,
    paddingBottom: props.paddingBottom || props.paddingY || props.padding || 0,
    paddingLeft: props.paddingLeft || props.paddingX || props.padding || 0,
    paddingRight: props.paddingRight || props.paddingX || props.padding || 0,
    marginTop: props.marginTop || props.marginY || props.margin || 0,
    marginBottom: props.marginBottom || props.marginY || props.margin || 0,
    marginLeft: props.marginLeft || props.marginX || props.margin || 0,
    marginRight: props.marginRight || props.marginX || props.margin || 0,
    gap: props.gap || 0,
    backgroundColor: props.backgroundColor,
    borderStyle: props.borderStyle ? 'solid' : 'none',
    borderColor: props.borderColor,
    ...style,
  };
  return <div style={webStyle}>{children}</div>;
};

export const Text = ({ children, style, color, backgroundColor, bold, italic, dim, ...props }: any) => {
  const webStyle = {
    color: color,
    backgroundColor: backgroundColor,
    fontWeight: bold ? 'bold' : 'normal',
    fontStyle: italic ? 'italic' : 'normal',
    opacity: dim ? 0.5 : 1,
    whiteSpace: 'pre-wrap',
    ...style,
  };
  return <span style={webStyle}>{children}</span>;
};

export const Newline = ({ count = 1 }: { count?: number }) => (
  <>{Array.from({ length: count }).map((_, i) => <br key={i} />)}</>
);

export const Spacer = () => <div style={{ flexGrow: 1 }} />;

// Hooks
export const useApp = () => ({
  exit: () => console.log('Exit requested'),
});

export const useStdin = () => ({
  stdin: null,
  isRawModeSupported: false,
  setRawMode: () => {},
});

export const useInput = (inputHandler: (input: string, key: any) => void) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Basic mapping of browser keys to Ink keys
      const key = {
        upArrow: event.key === 'ArrowUp',
        downArrow: event.key === 'ArrowDown',
        leftArrow: event.key === 'ArrowLeft',
        rightArrow: event.key === 'ArrowRight',
        return: event.key === 'Enter',
        escape: event.key === 'Escape',
        backspace: event.key === 'Backspace',
        delete: event.key === 'Delete',
        tab: event.key === 'Tab',
        shift: event.shiftKey,
        ctrl: event.ctrlKey,
        meta: event.metaKey,
      };
      inputHandler(event.key.length === 1 ? event.key : '', key);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inputHandler]);
};

// Render function
export async function render(node: ReactNode): Promise<Instance> {
  console.log('Web render called');
  return {
    unmount: () => {},
    waitUntilExit: () => new Promise(() => {}), // Never exits in web
    cleanup: () => {},
  };
}

export async function createRoot(): Promise<Root> {
  return {
    render: (node: ReactNode) => {
      // In a real implementation, this would trigger a re-render of the web app
      console.log('Web root render called');
    },
    unmount: () => {},
    waitUntilExit: () => new Promise(() => {}),
  };
}

// Re-exports for compatibility
export { ThemeProvider, useTheme, useThemeSetting, usePreviewTheme } from './components/design-system/ThemeProvider.js';
export const BaseBox = Box;
export const BaseText = Text;
export const Button = (props: any) => <button {...props} />;
export const Link = ({ url, children }: any) => <a href={url} target="_blank" rel="noopener noreferrer">{children}</a>;

// Additional shims as needed...
