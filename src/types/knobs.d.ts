declare module "knobs" {
  export type KnobMode = "bounded" | "infinite" | "min-only";

  export interface KnobOptions {
    mode: KnobMode;
    min: number;
    max: number;
    value: number;
    step: number;
    size: number;
    tickCount: number;
    showTicks: boolean;
    showValueLabels: boolean;
    showValueDisplay: boolean;
    valueLabels: string[];
    label: string;
    className: string;
    dialColor: string;
    indicatorColor: string;
    tickColor: string;
    labelColor: string;
    backgroundColor: string;
    valueDisplayColor: string;
    knobStyle: string;
  }

  export interface SliderOptions {
    min: number;
    max: number;
    value: number;
    step: number;
    length: number;
    width: number;
    tickCount: number;
    showTicks: boolean;
    showValueLabels: boolean;
    showValueDisplay: boolean;
    valueLabels: string[];
    label: string;
    className: string;
    thumbColor: string;
    trackColor: string;
    tickColor: string;
    labelColor: string;
    backgroundColor: string;
    valueDisplayColor: string;
    thumbStyle: string;
    showToggle: boolean;
    toggleLabel: string;
    toggleLedColor: string;
  }

  export interface KnobChangeEvent {
    value: number;
    normalizedValue: number;
    target: Knob;
  }

  export interface SliderChangeEvent {
    value: number;
    normalizedValue: number;
    target: Slider;
  }

  export interface ToggleChangeEvent {
    active: boolean;
    target: Slider;
  }

  export interface IKnob {
    getValue(): number;
    setValue(value: number): void;
    onChange(callback: (e: KnobChangeEvent) => void): void;
    destroy(): void;
  }

  export interface ISlider {
    getValue(): number;
    setValue(value: number): void;
    onChange(callback: (e: SliderChangeEvent) => void): void;
    onToggle(callback: (e: ToggleChangeEvent) => void): void;
    destroy(): void;
  }

  export const DEFAULT_OPTIONS: KnobOptions;
  export const DEFAULT_SLIDER_OPTIONS: SliderOptions;

  export interface GlobalConfig {
    [key: string]: unknown;
  }

  export const globalConfig: GlobalConfig;
  export function configureKnobs(config: Partial<GlobalConfig>): void;

  export class Knob implements IKnob {
    constructor(container: HTMLElement | string, options?: Partial<KnobOptions>);
    getValue(): number;
    setValue(value: number): void;
    onChange(callback: (e: KnobChangeEvent) => void): void;
    destroy(): void;
  }

  export class Slider implements ISlider {
    constructor(container: HTMLElement | string, options?: Partial<SliderOptions>);
    getValue(): number;
    setValue(value: number): void;
    onChange(callback: (e: SliderChangeEvent) => void): void;
    onToggle(callback: (e: ToggleChangeEvent) => void): void;
    destroy(): void;
  }

  // Factory Functions for Knobs
  export function createVolumeKnob(container: HTMLElement | string, options?: Partial<KnobOptions>): Knob;
  export function createSpinalTapKnob(container: HTMLElement | string, options?: Partial<KnobOptions>): Knob;
  export function createInfiniteKnob(container: HTMLElement | string, options?: Partial<KnobOptions>): Knob;
  export function createMinOnlyKnob(container: HTMLElement | string, options?: Partial<KnobOptions>): Knob;
  export function createPanKnob(container: HTMLElement | string, options?: Partial<KnobOptions>): Knob;

  // Factory Functions for Sliders
  export function createFader(container: HTMLElement | string, options?: Partial<SliderOptions>): Slider;
  export function createVolumeFader(container: HTMLElement | string, options?: Partial<SliderOptions>): Slider;
  export function createMuteFader(container: HTMLElement | string, options?: Partial<SliderOptions>): Slider;

  // DOM Initializer
  export function initFromDOM(root?: HTMLElement | Document): { knobs: Knob[]; sliders: Slider[] };
}