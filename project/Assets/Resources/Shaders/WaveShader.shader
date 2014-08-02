Shader "WaveShader"
{
	Properties
	{
	
		_wavelength ( "wavelength", Float ) = 0.5
		_phase ( "phase", Float ) = 0.5
		_lineWidth ( "line width", Float ) = 0.005
		_type ( "type", int ) = 0
		
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
			
			float _wavelength;
			float _phase;
			float _lineWidth;
			float _type;


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
			
			
			float4 frag( fragmentInput i ) : COLOR
			{
					
				_lineWidth += 0.001;
			
				//float screenLength = 1.0;
			
				//float numPeriods = screenLength / _wavelength;
	
				//float totalT = ( 3.14 * numPeriods );
				
				//float startingT = totalT * -0.5;
				
				//float t = startingT + _phase;
			
				
				float lineY = sin( i.texcoord0.x * 20.0 ) * 0.1;
				
				lineY += 0.5;
				
				float dif = abs( lineY - i.texcoord0.y );
			
				float4 col = float4( 1.0, 0.0, 0.0, 1.0 );
				
				
				//everything outside of line is transparent
				if( dif > _lineWidth )
					col = float4( 0.0, 0.0, 0.0, 0.0 );
				
				return col;
				
			}
			
			ENDCG
    	}
    	
	}
	
}


