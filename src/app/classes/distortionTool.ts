export  class DistortionTool {
    constructor() {

    }
    
    public  createSoftDistortionCurve(ctx: AudioContext, driveAmount: number): Float32Array<ArrayBuffer> {

            const distortionFactor = typeof driveAmount === "number" ? driveAmount : 50;
            
            const curveResolution = ctx?.sampleRate ?? 44100;
            const distortionLookupTable = new Float32Array(curveResolution);
            
            const degreesToRadians = Math.PI / 180;

            for (let sampleIndex = 0; sampleIndex < curveResolution; sampleIndex++) {
                const inputSample = (sampleIndex * 2) / curveResolution - 1;
                
                const saturationNumerator = (3 + distortionFactor) * inputSample * 20 * degreesToRadians;
                const saturationDenominator = Math.PI + distortionFactor * Math.abs(inputSample);
                
                distortionLookupTable[sampleIndex] = saturationNumerator / saturationDenominator;
            }
            
            return distortionLookupTable;
        }
    }