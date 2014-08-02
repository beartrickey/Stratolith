Shader "ScanLineShader"
{

	Properties
	{
	
		numLines ("numLines", int ) = 5
		vOffset ( "vOffset", float ) = 0.0
		hOffset ( "hOffset", float ) = 0.1
		
	}
 
 
	SubShader
	{
	
		Tags{"Queue"="Transparent"}
    	Blend SrcAlpha OneMinusSrcAlpha
	 
	 	GrabPass { }
	 	
	    Pass
	    {
			CGPROGRAM
			#pragma vertex vert_img
			#pragma fragment frag
			#pragma target 3.0
			
			#include "UnityCG.cginc"
			
			int numLines;
			float vOffset;
			float hOffset;
			
			sampler2D _GrabTexture : register(s0);
			
			
			float4 vert( appdata_base v ) : POSITION
			{
			
				return mul ( UNITY_MATRIX_MVP, v.vertex );
				
			}
			
			
			float4 frag( float4 sp:WPOS ) : COLOR
			{
				
				float2 screenSpace = sp.xy / _ScreenParams.xy;
				
				float4 finalColor = tex2D( _GrabTexture, screenSpace );
				
				
				//line 1
				float startingPoint = 0.1 + vOffset;
				if( startingPoint <= 0.0 )
				{
					startingPoint *= -1.0;
					startingPoint -= trunc(startingPoint);
					startingPoint = 1.0 - startingPoint;
				}
				if( numLines >= 1 && screenSpace.y >= startingPoint && screenSpace.y <= startingPoint + 0.005 )
				{
					finalColor = tex2D( _GrabTexture, float2( screenSpace.x + hOffset, screenSpace.y ) ); //west
				}
				
				
				//line 2
				startingPoint = 0.4 + vOffset;
				if( startingPoint <= 0.0 )
				{
					startingPoint *= -1.0;
					startingPoint -= trunc(startingPoint);
					startingPoint = 1.0 - startingPoint;
				}
				if( numLines >= 2 && screenSpace.y >= startingPoint && screenSpace.y <= startingPoint + 0.01 )
				{
					finalColor = tex2D( _GrabTexture, float2( screenSpace.x + hOffset, screenSpace.y ) ); //west
				}
				
				
				//line 3
				startingPoint = 0.5 + vOffset;
				if( startingPoint <= 0.0 )
				{
					startingPoint *= -1.0;
					startingPoint -= trunc(startingPoint);
					startingPoint = 1.0 - startingPoint;
				}
				if( numLines >= 3 && screenSpace.y >= startingPoint && screenSpace.y <= startingPoint + 0.007 )
				{
					finalColor = tex2D( _GrabTexture, float2( screenSpace.x + hOffset, screenSpace.y ) ); //west
				}
				
				
				//line 4
				startingPoint = 0.7 + vOffset;
				if( startingPoint <= 0.0 )
				{
					startingPoint *= -1.0;
					startingPoint -= trunc(startingPoint);
					startingPoint = 1.0 - startingPoint;
				}
				if( numLines >= 4 && screenSpace.y >= startingPoint && screenSpace.y <= startingPoint + 0.009 )
				{
					finalColor = tex2D( _GrabTexture, float2( screenSpace.x + hOffset, screenSpace.y ) ); //west
				}
				
				
				//line 5
				startingPoint = 0.9 + vOffset;
				if( startingPoint <= 0.0 )
				{
					startingPoint *= -1.0;
					startingPoint -= trunc(startingPoint);
					startingPoint = 1.0 - startingPoint;
				}
				if( numLines >= 5 && screenSpace.y >= startingPoint && screenSpace.y <= startingPoint + 0.008 )
				{
					finalColor = tex2D( _GrabTexture, float2( screenSpace.x + hOffset, screenSpace.y ) ); //west
				}
				
				
				
				return finalColor;
				
			}

			
			ENDCG
			
    	}
    	
	}
	
}


