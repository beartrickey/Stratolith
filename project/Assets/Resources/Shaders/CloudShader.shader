Shader "CloudShader"
{
	Properties
	{
		
	}

 
	SubShader
	{
	
		Tags {Queue = Transparent}
		ZWrite Off
		Cull Off
    	Blend SrcAlpha OneMinusSrcAlpha
    	
    	Pass
	    { 
			CGPROGRAM
			#pragma vertex vert
			#pragma fragment frag
			#pragma target 3.0

			#include "UnityCG.cginc"
			

			float4 vert( appdata_base v ) : POSITION
			{
			
				return mul ( UNITY_MATRIX_MVP, v.vertex );
				
			}

			
			float4 frag( float4 sp:WPOS ) : COLOR
			{
			
//				float2 screenSpace = sp.xy / _ScreenParams.xy;
				float2 screenSpace = sp.xy;
				
				// Grid parameters
//				float gridSpacing = 0.005;
//				float lineWidth = 0.001;
				float gridSpacing = 5.0;
				float lineWidth = 1.0;

				// Get closest grid line
				int closestLineIndex = floor(screenSpace.x / gridSpacing);
				float closestLineX = closestLineIndex * gridSpacing;
				float xDif = abs(screenSpace.x - closestLineX);
				
				
				if( xDif < lineWidth )
				{
					return float4( 1.0, 1.0, 1.0, 0.2 );
				}
				else
				{
					return float4( 0.0, 0.0, 0.0, 0.0 );
				}
				
			}
			ENDCG
    	}
    	
	}
	
}


