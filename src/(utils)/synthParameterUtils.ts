export enum PARAMETER_TYPE {

    Effect,
    ADSR,
    Other
}

export enum PARAMETER_LABEL {
    Attack = "Attack", 
    Decay = "Decay", 
    Sustain = "Sustain", 
    Release = "Release", 
    ReverbWet = "Reverb Wet", 
    DelayWet = "Delay Wet", 
    DelayTime = "Delay Time", 
    DistortionWet = "Distortion Wet", 
    DistortionDrive = "Distortion Drive"
}

export interface ParameterTargetRef {
    typeOfParameter: PARAMETER_TYPE;
    target: PARAMETER_LABEL;
}

export interface ParameterObject {
    parameterName: string;
    parameterTarget: ParameterTargetRef;
    defaultValue: number;
    minValue?: number;
    maxValue?: number;
    step: number;
    unit: string;
}