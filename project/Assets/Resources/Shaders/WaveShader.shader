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
	
		Tags{"Queue"="Transparent"}
    	Blend SrcAlpha OneMinusSrcAlpha
	 
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
			
			float _defenseWavelength;
			float _defensePhase;
			float _defenseType;

			struct vertexInput
			{
			
				float4 vertex : POSITION;
				float4 texcoord0 : TEXCOORD0;
				
			};


			struct fragmentInput
			{
			
				float4 position : SV_POSITION;
				float4 texcoord0 : TEXCOORD0;
				
			};


			fragmentInput vert( vertexInput i )
			{
			
				fragmentInput o;
				o.position = mul (UNITY_MATRIX_MVP, i.vertex);
				o.texcoord0 = i.texcoord0;
				return o;
				
			}
			
			
			float4 drawWave( fragmentInput i, float _wavelength, float _phase, float _type, float4 _color )
			{
			
				// Initial setup
				float uvx = i.texcoord0.x;
				float uvy = i.texcoord0.y;
				
				// Wave periods, t
				float numPeriods = _resolutionX / -_wavelength;
				float totalT = ( 3.14 * numPeriods );
				float startingT = (totalT * -0.5) + _phase;
				float t = startingT + (uvx * totalT);
				
				float startingY = 0.5;
				
							
				// Line Width is relative to sine outcome
				float wavelengthMultiplier = 1.0;
				wavelengthMultiplier += 4.0 - ((_wavelength / 200.0) * 4.0);
				
				if( wavelengthMultiplier < 1.0 )
					wavelengthMultiplier = 1.0;
				
				float lineWidthMax = 0.007 * wavelengthMultiplier;
				float lineWidthMin = 0.0035 * wavelengthMultiplier;
				float lineWidthLength = lineWidthMax - lineWidthMin;
				float sineOutcome = sin( t );
				float absoluteOutcome = abs( sineOutcome ); // 0.0 to 1.0
				float resultLineWidth = lineWidthMax - (lineWidthLength * absoluteOutcome);
				
				
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
			
			
				// Color
				float dif = abs( lineY - uvy ); // i.texcoord0.y
				
				// Glow
				if( dif > resultLineWidth )
				{

					float fadeDistance = resultLineWidth * 3.0;
					float alpha = 1.0 - (dif / fadeDistance);
					
					// Clamp
					if( alpha < 0.0 )
						alpha = 0.0;
						
					if( alpha > 1.0 )
						alpha = 1.0;

					_color.w *= alpha;

				}
			
				return _color;
			}
			
			float2 getWaveYandThickness( float _uvx, float _wavelength, float _phase, float _type )
			{
			
				// Wave periods, t
				float numPeriods = _resolutionX / -_wavelength;
				float totalT = ( 3.14 * numPeriods );
				float startingT = (totalT * -0.5) + _phase;
				float t = startingT + (_uvx * totalT);
				
				float startingY = 0.5;
				
							
				// Line Width is relative to sine outcome
				float wavelengthMultiplier = 1.0;
				wavelengthMultiplier += 4.0 - ((_wavelength / 200.0) * 4.0);
				
				if( wavelengthMultiplier < 1.0 )
					wavelengthMultiplier = 1.0;
				
				float lineWidthMax = 0.007 * wavelengthMultiplier;
				float lineWidthMin = 0.0035 * wavelengthMultiplier;
				float lineWidthLength = lineWidthMax - lineWidthMin;
				float sineOutcome = sin( t );
				float absoluteOutcome = abs( sineOutcome ); // 0.0 to 1.0
				float resultLineWidth = lineWidthMax - (lineWidthLength * absoluteOutcome);
				
				
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
				
				return float2(
					lineY,
					resultLineWidth
				);
			
			}
			
			
			float4 colorWave( float _ypos, float _thickness, float _uvy, float4 _color )
			{
			
				// Color
				float dif = abs( _ypos - _uvy ); // i.texcoord0.y
				
				// Glow
				if( dif > _thickness )
				{

					float fadeDistance = _thickness * 3.0;
					float alpha = 1.0 - (dif / fadeDistance);
					
					// Clamp
					if( alpha < 0.0 )
						alpha = 0.0;
						
					if( alpha > 1.0 )
						alpha = 1.0;

					_color.w *= alpha;

				}
			
				return _color;
			
			}
			
			
			float4 frag( fragmentInput i ) : COLOR
			{
			
				// Initial setup
				float uvx = i.texcoord0.x;
				float uvy = i.texcoord0.y;
				
				float4 resultColor = float4( 1.0, 1.0, 1.0, 0.0 );
				
				
				// Red result wave outline
				
				
				// Red result wave area
				
				
				// Yellow defense wave
				float2 defenseWaveYandThickness = getWaveYandThickness(
					uvx,
					_defenseWavelength,
					_defensePhase,
					_defenseType
				);
				
				float4 defenseColor = colorWave(
					defenseWaveYandThickness.x,
					defenseWaveYandThickness.y,
					uvy,
					float4( 1.0, 0.94, 0.25, 0.8 )
				);
				
				
				// White hack wave
				float2 hackWaveYandThickness = getWaveYandThickness(
					uvx,
					_hackWavelength,
					_hackPhase,
					_hackType
				);
				
				float4 hackColor = colorWave(
					hackWaveYandThickness.x,
					hackWaveYandThickness.y,
					uvy,
					float4( 1.0, 1.0, 1.0, 0.7 )
				);
				
				
				// Result wave line
				float resultWaveY = 0.5 + (defenseWaveYandThickness.x - 0.5) + (hackWaveYandThickness.x - 0.5);
				
				float4 resultWaveLineColor = colorWave(
					resultWaveY,
					hackWaveYandThickness.y,
					uvy,
					float4( 0.79, 0.0, 0.0, 0.25 )
				);
				
				
				// Result wave area
				
				if( resultWaveY < 0.5 && uvy < 0.5 && uvy > resultWaveY )
				{
					resultColor = float4( 0.79, 0.0, 0.0, 0.25 );
				}
				else if( resultWaveY > 0.5 && uvy > 0.5 && uvy < resultWaveY )
				{
					resultColor = float4( 0.79, 0.0, 0.0, 0.25 );
				}
				
				
				// Blend (SrcAlpha, OneMinusSrcAlpha)
				resultColor = float4(
					(resultColor.x * (1.0 - resultWaveLineColor.w)) + (resultWaveLineColor.x * resultWaveLineColor.w),
					(resultColor.y * (1.0 - resultWaveLineColor.w)) + (resultWaveLineColor.y * resultWaveLineColor.w),
					(resultColor.z * (1.0 - resultWaveLineColor.w)) + (resultWaveLineColor.z * resultWaveLineColor.w),
					resultColor.w + resultWaveLineColor.w
				);
				
				
				// Blend (SrcAlpha, OneMinusSrcAlpha)
				resultColor = float4(
					(resultColor.x * (1.0 - defenseColor.w)) + (defenseColor.x * defenseColor.w),
					(resultColor.y * (1.0 - defenseColor.w)) + (defenseColor.y * defenseColor.w),
					(resultColor.z * (1.0 - defenseColor.w)) + (defenseColor.z * defenseColor.w),
					resultColor.w + defenseColor.w
				);
				
				
				// Blend (SrcAlpha, OneMinusSrcAlpha)
				resultColor = float4(
					(resultColor.x * (1.0 - hackColor.w)) + (hackColor.x * hackColor.w),
					(resultColor.y * (1.0 - hackColor.w)) + (hackColor.y * hackColor.w),
					(resultColor.z * (1.0 - hackColor.w)) + (hackColor.z * hackColor.w),
					resultColor.w + hackColor.w
				);
			
				return resultColor;
				
			}
			
			ENDCG
    	}
    	
	}
	
}


