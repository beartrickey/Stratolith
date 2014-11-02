Shader "WaveShader"
{
	Properties
	{
	
		_resolutionX ( "resolutionX", Float ) = 470.0
		_resolutionY ( "resolutionY", Float ) = 235.0
	
		_hackWavelength ( "wavelength", Float ) = 0.5
		_hackPhase ( "phase", Float ) = 0.5
		_hackType ( "type", int ) = 0
		
		_defenseWavelength ( "wavelength", Float ) = 0.5
		_defensePhase ( "phase", Float ) = 0.5
		_defenseType ( "type", int ) = 0
		
	}

 
	SubShader
	{
	
		Tags {Queue = Transparent}
		ZWrite Off
    	Blend SrcAlpha OneMinusSrcAlpha
    	
    	// NO LONGER IN USE
//    	float4 blendColor( float4 _destination, float4 _source )
//		{
//		
//			float4 outColor : COLOR;
//		
//			float outA = _source.w + (_destination.w * (1.0 - _source.w));
//			float3 outRgb = (_destination.xyz * (1.0 - _source.w)) + (_source.xyz * _source.w);
//			outRgb /= outA;
//			
//			outColor = float4(
//				outRgb.x,
//				outRgb.y,
//				outRgb.z,
//				outA
//			);
//			
//			return outColor;
//		
//		}
    	
    	
    	
    	/////////////////////////////////////////////////////////////
	 	// DEFENSE PASS
	 	/////////////////////////////////////////////////////////////
    	Pass
	    { 
			CGPROGRAM
			#pragma vertex vert
			#pragma fragment frag
			#pragma target 3.0

			#include "UnityCG.cginc"
			
			float _resolutionX;
			float _resolutionY;
			
			float _defenseWavelength;
			float _defensePhase;
			float _defenseType;

			struct VertexInput
			{
				float4 vertex : POSITION;
				float4 texcoord0 : TEXCOORD0;
			};


			struct FragmentInput
			{
				float4 position : SV_POSITION;
				float4 texcoord0 : TEXCOORD0;
			};


			FragmentInput vert( VertexInput i )
			{
				FragmentInput o;
				o.position = mul (UNITY_MATRIX_MVP, i.vertex);
				o.texcoord0 = i.texcoord0;
				return o;
			}
			
			
			float drawLine( FragmentInput i, float2 p1, float2 p2 )
			{
				float Thickness = 0.005;
				
				float2 uv = i.texcoord0.xy;

				float a = abs(distance(p1, uv));
				float b = abs(distance(p2, uv));
				float c = abs(distance(p1, p2));

//				if ( a >= c || b >=  c ) return 0.0;

				float p = (a + b + c) * 0.5;

				// median to (p1, p2) vector
				float h = 2 / c * sqrt( p * (p - a) * (p - b) * (p - c) );

				// main line
				float mainLine = mix(1.0, 0.0, smoothstep(0.5 * Thickness, 1.5 * Thickness, h));

				// glow
				float glow = mix(0.15, 0.0, smoothstep(0.75 * Thickness, 8.0 * Thickness, h));
				
				float returnValue = mainLine + glow;
				
				return returnValue;
			}
			
			
			float2 getWaveOutput( float _x, float _wavelength, float _phase, float _type )
			{
			
				// Wave periods, t
				float numPeriods = _resolutionX / -_wavelength;
				float totalT = ( 3.14 * numPeriods );
				float startingT = (totalT * -0.5) + _phase;
				float t = startingT + (_x * totalT);
				
				float startingY = 0.5;
				
				// Sine wave
				float amplitude = 0.35;
				float sinWaveY = sin( t );
				float lineY = 0.0;
				
				// Wave Types
				if( _type == 0 ) // Sine
				{
				
					lineY = startingY + (sinWaveY * amplitude);
					
				}
				else if( _type == 1 ) // M W wave
				{

					lineY = startingY + (sinWaveY * amplitude);

					float offset = 0.0;
					float amplitudeOffset = 0.0;
					float strength = 0.0;

					if( sinWaveY > 0.5 )
					{
						offset = sinWaveY - 0.5;
						strength = (offset / 0.5) * 1.5;
						amplitudeOffset = offset * strength;
						lineY -= amplitudeOffset;
					}
					else if( sinWaveY < -0.5 )
					{
						offset = -sinWaveY - 0.5;
						strength = (offset / 0.5) * 1.5;
						amplitudeOffset = offset * strength;
						lineY += amplitudeOffset;
					}
						
				}
				else if( _type == 2 ) // Flat line
				{

					lineY = startingY + (sinWaveY * amplitude);

					float currentPeriod = floor( t / 6.28 );
					float tOffset = t - (currentPeriod * 6.28);
					float startEffect = 2.0;//3.14;
					float endEffect = 5.5;//4.71;
					float effectLength = endEffect - startEffect;
					float strength = 0.0;

					if( tOffset > startEffect && tOffset < endEffect )
					{
						float normalizedEffect = (tOffset - startEffect) / effectLength;
						strength = (cos( normalizedEffect * 6.28 ) * 0.5) - 0.5;

						lineY -= ( sinWaveY * -strength);
					}
					
				}
				else if( _type == 3 ) //stretch
				{
					
					
				}
				
				return float2( _x, lineY );
			
			}
			
			
			float4 frag( FragmentInput i ) : COLOR
			{
			
				// Initial setup
				float4 defenseColor : COLOR = float4( 1.0, 0.94, 0.25, 0.8 );

				
				// Yellow defense wave
				float defenseOutputStrength = drawLine(
					i,
					getWaveOutput(
						i.texcoord0.x - 0.01,
						_defenseWavelength,
						_defensePhase,
						_defenseType
					),
					getWaveOutput(
						i.texcoord0.x + 0.01,
						_defenseWavelength,
						_defensePhase,
						_defenseType
					)
				);
				
				return float4(
					defenseColor.x, defenseColor.y, defenseColor.z, defenseColor.w * defenseOutputStrength
				);
				
			}
			ENDCG
    	}
	 
	 
	 
	 
	 	/////////////////////////////////////////////////////////////
	 	// HACK PASS
	 	/////////////////////////////////////////////////////////////
	    Pass
	    { 
			CGPROGRAM
			#pragma vertex vert
			#pragma fragment frag
			#pragma target 3.0

			#include "UnityCG.cginc"
			
			float _resolutionX;
			float _resolutionY;
			
			float _hackWavelength;
			float _hackPhase;
			float _hackType;

			struct VertexInput
			{
				float4 vertex : POSITION;
				float4 texcoord0 : TEXCOORD0;	
			};


			struct FragmentInput
			{
				float4 position : SV_POSITION;
				float4 texcoord0 : TEXCOORD0;
			};


			FragmentInput vert( VertexInput i )
			{
				FragmentInput o;
				o.position = mul (UNITY_MATRIX_MVP, i.vertex);
				o.texcoord0 = i.texcoord0;
				return o;	
			}
			
			
			float drawLine( FragmentInput i, float2 p1, float2 p2 )
			{
				float Thickness = 0.006;
				
				float2 uv = i.texcoord0.xy;

				float a = abs(distance(p1, uv));
				float b = abs(distance(p2, uv));
				float c = abs(distance(p1, p2));

//				if ( a >= c || b >=  c ) return 0.0;

				float p = (a + b + c) * 0.5;

				// median to (p1, p2) vector
				float h = 2 / c * sqrt( p * (p - a) * (p - b) * (p - c) );

				// main line
				float mainLine = mix(1.0, 0.0, smoothstep(0.0 * Thickness, 1.5 * Thickness, h));

				// glow
				float glow = mix(0.15, 0.0, smoothstep(0.75 * Thickness, 8.0 * Thickness, h));
//				float glow = 0.0;
				
				float returnValue = mainLine + glow;
				
				return returnValue;
			}
			
			
			float2 getWaveOutput( float _x, float _wavelength, float _phase, float _type )
			{
			
				// Wave periods, t
				float numPeriods = _resolutionX / -_wavelength;
				float totalT = ( 3.14 * numPeriods );
				float startingT = (totalT * -0.5) + _phase;
				float t = startingT + (_x * totalT);
				
				float startingY = 0.5;
				
				// Sine wave
				float amplitude = 0.35;
				float sinWaveY = sin( t );
				float lineY = 0.0;
				
				// Wave Types
				if( _type == 0 ) // Sine
				{
				
					lineY = startingY + (sinWaveY * amplitude);
					
				}
				else if( _type == 1 ) // M W wave
				{

					lineY = startingY + (sinWaveY * amplitude);

					float offset = 0.0;
					float amplitudeOffset = 0.0;
					float strength = 0.0;

					if( sinWaveY > 0.5 )
					{
						offset = sinWaveY - 0.5;
						strength = (offset / 0.5) * 0.5;
						amplitudeOffset = offset * strength;
						lineY -= amplitudeOffset;
					}
					else if( sinWaveY < -0.5 )
					{
						offset = -sinWaveY - 0.5;
						strength = (offset / 0.5) * 0.5;
						amplitudeOffset = offset * strength;
						lineY += amplitudeOffset;
					}
						
				}
				else if( _type == 2 ) // Flat line
				{

					lineY = startingY + (sinWaveY * amplitude);

					float currentPeriod = floor( t / 6.28 );
					float tOffset = t - (currentPeriod * 6.28);
					float startEffect = 3.14;
					float endEffect = 4.71;
					float effectLength = endEffect - startEffect;
					float strength = 0.0;

					if( tOffset > startEffect && tOffset < endEffect )
					{
						float normalizedEffect = (tOffset - startEffect) / effectLength;
						strength = (cos( normalizedEffect * 6.28 ) * 0.5) - 0.5;

						lineY -= ( sinWaveY * -strength);
					}
					
				}
				else if( _type == 3 ) //stretch
				{
					
					
				}
				
				return float2( _x, lineY );
			
			}
			
			
			float4 frag( FragmentInput i ) : COLOR
			{
			
				// Initial setup
				float4 hackColor : COLOR = float4( 1.0, 1.0, 1.0, 0.7 );
				
				// White hack wave
				float hackOutputStrength = drawLine(
					i,
					getWaveOutput(
						i.texcoord0.x - 0.01,
						_hackWavelength,
						_hackPhase,
						_hackType
					),
					getWaveOutput(
						i.texcoord0.x + 0.01,
						_hackWavelength,
						_hackPhase,
						_hackType
					)
				);
				
				
				return float4(
					hackColor.x, hackColor.y, hackColor.z, hackColor.w * hackOutputStrength
				);
				
				
				
				// Result wave line
//				float resultWaveY = 0.5 + (defenseWaveYandThickness.x - 0.5) + (hackWaveYandThickness.x - 0.5);
				
//				float4 resultWaveLineColor = colorWave(
//					resultWaveY,
//					hackWaveYandThickness.y,
//					uvy,
//					float4( 0.8, 0.0, 0.0, 0.25 )
//				);

				
				
				// Result wave area
//				if( (resultWaveY < 0.5 && uvy < 0.5 && uvy > (resultWaveY - 0.005)) ||
//					(resultWaveY > 0.5 && uvy > 0.5 && uvy < (resultWaveY + 0.005))
//				)
//				{
//					returnColor = addOrBlendColor( resultColor, float4( 0.8, 0.0, 0.0, 0.25 ) );
//				}
				
				
				// Blend ResultWaveLine (SrcAlpha, OneMinusSrcAlpha)
//				returnColor = addOrBlendColor( resultColor, resultWaveLineColor );

				
			}		
			ENDCG
    	}
    	
	}
	
}


