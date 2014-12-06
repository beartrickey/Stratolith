Shader "CloudShader"
{
 
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
			
				float2 screenSpace = sp.xy / _ScreenParams.xy;
//				float2 screenSpace = sp.xy;
				
				// Grid parameters
				float gridSpacing = 0.015;
				float lineWidth = 0.003;
				
				// Follow the slope down to the x-intercept
				float xIntercept = screenSpace.x - screenSpace.y;  // Assuming a slope of 45 degress (x == y)

				// Get closest grid line
				int closestLineIndex = floor(xIntercept / gridSpacing);
				float closestLineX = closestLineIndex * gridSpacing;
				float xDif = abs(xIntercept - closestLineX);
				
				
				if( xDif < lineWidth )
				{
					return float4( 1.0, 1.0, 1.0, 0.1 );
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


