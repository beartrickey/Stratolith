Shader "WaveShader"
{
	Properties
	{
	
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
			
			
			float4 drawWave( fragmentInput i, float _wavelength, float _phase, float _type )
			{
			
				// Initial setup
				float resolutionX = 470.0;
				float resolutionY = 235.0;
				float uvx = i.texcoord0.x;
				float uvy = i.texcoord0.y;
				
				// Wave periods, t
				float numPeriods = resolutionX / -_wavelength;
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
				float4 col = float4( 1.0, 1.0, 1.0, 0.5 );
				
				// Glow
				if( dif > resultLineWidth )
				{

					float fadeDistance = resultLineWidth * 8.0;
					float alpha = 0.6 - (sqrt(dif) * 3.0);
					
					if( alpha < 0.0 )
						alpha = 0.0;
					if( alpha > 1.0 )
						alpha = 1.0;
					
					col = float4( 1.0, 1.0, 1.0, alpha );

				}
			
				return col;
			}
			
			
			float4 frag( fragmentInput i ) : COLOR
			{
				
				float4 resultColor = float4( 0.0, 0.0, 0.0, 0.0 );
				float4 hackColor = float4( 0.0, 0.0, 0.0, 0.0 );
				float4 defenseColor = float4( 0.0, 0.0, 0.0, 0.0 );
				
				hackColor = drawWave( i, _hackWavelength, _hackPhase, _hackType );
				defenseColor = drawWave( i, _defenseWavelength, _defensePhase, _defenseType );
				
				resultColor = float4(
					hackColor.x * defenseColor.x,
					hackColor.y * defenseColor.y,
					hackColor.z * defenseColor.z,
					hackColor.w + defenseColor.w
				);
				
				return resultColor;
				
			}
			
			ENDCG
    	}
    	
	}
	
}


