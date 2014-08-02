Shader "BlurBehindShader"
{

	Properties
	{
	
		blurStrength ( "blurStrength", int ) = 1
		resolution ( "resolution", Range( 0.0, 0.05) ) = 0.0
		brightness ( "brightness", Range( 0.0, 1.0) ) = 1.0
		
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
			
			int blurStrength;
			float resolution;
			float brightness;
			
			
			sampler2D _GrabTexture : register(s0);
			
			
			float4 vert( appdata_base v ) : POSITION
			{
			
				return mul ( UNITY_MATRIX_MVP, v.vertex );
				
			}
			
			
			float4 frag( float4 sp:WPOS ) : COLOR
			{
				//float resolution = 0.0075;
				
				float blurResolution = resolution;
				
				float blurFactor = 1.0;
				
				//int blurStrength = 4;
				
				float steps = 1.0;
				
				float2 screenSpace = sp.xy / _ScreenParams.xy;
				
				float4 averageColor = tex2D( _GrabTexture, screenSpace );
				
				if( blurStrength >= 1 )
				{
				
					averageColor += tex2D( _GrabTexture, float2( screenSpace.x - blurResolution, screenSpace.y ) ); //west
					averageColor += tex2D( _GrabTexture, float2( screenSpace.x - blurResolution, screenSpace.y + blurResolution) ); //northwest
					averageColor += tex2D( _GrabTexture, float2( screenSpace.x, screenSpace.y + blurResolution ) ); //north
					averageColor += tex2D( _GrabTexture, float2( screenSpace.x + blurResolution, screenSpace.y + blurResolution) ); //northeast
					averageColor += tex2D( _GrabTexture, float2( screenSpace.x + blurResolution, screenSpace.y ) ); //east
					averageColor += tex2D( _GrabTexture, float2( screenSpace.x + blurResolution, screenSpace.y - blurResolution ) ); //southeast
					averageColor += tex2D( _GrabTexture, float2( screenSpace.x, screenSpace.y - blurResolution ) ); //sout
					averageColor += tex2D( _GrabTexture, float2( screenSpace.x - blurResolution, screenSpace.y - blurResolution ) ); //southwest
				
					steps += 8.0;
					
				}
				
				if( blurStrength >= 2 )
				{
					blurResolution += resolution;
					blurFactor = 0.5;
				
					averageColor += tex2D( _GrabTexture, float2( screenSpace.x - blurResolution, screenSpace.y ) ) * blurFactor; //west
					averageColor += tex2D( _GrabTexture, float2( screenSpace.x - blurResolution, screenSpace.y + blurResolution) ) * blurFactor; //northwest
					averageColor += tex2D( _GrabTexture, float2( screenSpace.x, screenSpace.y + blurResolution ) ) * blurFactor; //north
					averageColor += tex2D( _GrabTexture, float2( screenSpace.x + blurResolution, screenSpace.y + blurResolution) ) * blurFactor; //northeast
					averageColor += tex2D( _GrabTexture, float2( screenSpace.x + blurResolution, screenSpace.y ) ) * blurFactor; //east
					averageColor += tex2D( _GrabTexture, float2( screenSpace.x + blurResolution, screenSpace.y - blurResolution ) ) * blurFactor; //southeast
					averageColor += tex2D( _GrabTexture, float2( screenSpace.x, screenSpace.y - blurResolution ) ) * blurFactor; //sout
					averageColor += tex2D( _GrabTexture, float2( screenSpace.x - blurResolution, screenSpace.y - blurResolution ) ) * blurFactor; //southwest
				
					steps += 4.0;
					
				}
				
				
				if( blurStrength >= 3 )
				{
				
					blurResolution += resolution;
					blurFactor = 0.33;
				
					averageColor += tex2D( _GrabTexture, float2( screenSpace.x - blurResolution, screenSpace.y ) ) * blurFactor; //west
					averageColor += tex2D( _GrabTexture, float2( screenSpace.x - blurResolution, screenSpace.y + blurResolution) ) * blurFactor; //northwest
					averageColor += tex2D( _GrabTexture, float2( screenSpace.x, screenSpace.y + blurResolution ) ) * blurFactor; //north
					averageColor += tex2D( _GrabTexture, float2( screenSpace.x + blurResolution, screenSpace.y + blurResolution) ) * blurFactor; //northeast
					averageColor += tex2D( _GrabTexture, float2( screenSpace.x + blurResolution, screenSpace.y ) ) * blurFactor; //east
					averageColor += tex2D( _GrabTexture, float2( screenSpace.x + blurResolution, screenSpace.y - blurResolution ) ) * blurFactor; //southeast
					averageColor += tex2D( _GrabTexture, float2( screenSpace.x, screenSpace.y - blurResolution ) ) * blurFactor; //sout
					averageColor += tex2D( _GrabTexture, float2( screenSpace.x - blurResolution, screenSpace.y - blurResolution ) ) * blurFactor; //southwest
				
					steps += 2.67;
					
				}
				
				
				if( blurStrength >= 4 )
				{
				
					blurResolution += resolution;
					blurFactor = 0.25;
				
					averageColor += tex2D( _GrabTexture, float2( screenSpace.x - blurResolution, screenSpace.y ) ) * blurFactor; //west
					averageColor += tex2D( _GrabTexture, float2( screenSpace.x - blurResolution, screenSpace.y + blurResolution) ) * blurFactor; //northwest
					averageColor += tex2D( _GrabTexture, float2( screenSpace.x, screenSpace.y + blurResolution ) ) * blurFactor; //north
					averageColor += tex2D( _GrabTexture, float2( screenSpace.x + blurResolution, screenSpace.y + blurResolution) ) * blurFactor; //northeast
					averageColor += tex2D( _GrabTexture, float2( screenSpace.x + blurResolution, screenSpace.y ) ) * blurFactor; //east
					averageColor += tex2D( _GrabTexture, float2( screenSpace.x + blurResolution, screenSpace.y - blurResolution ) ) * blurFactor; //southeast
					averageColor += tex2D( _GrabTexture, float2( screenSpace.x, screenSpace.y - blurResolution ) ) * blurFactor; //sout
					averageColor += tex2D( _GrabTexture, float2( screenSpace.x - blurResolution, screenSpace.y - blurResolution ) ) * blurFactor; //southwest
				
					steps += 2.0;
					
				}
				
				averageColor /= steps;
				
				averageColor *= brightness;
				
				averageColor.w = 1.0;
			
				return averageColor;
				
			}


			//fixed4 frag( float4 sp:WPOS ) : COLOR
			//{
			
			//	return fixed4( sp.xy / _ScreenParams.xy, 0.0, 1.0 );
				
			//}
			
			ENDCG
			
    	}
    	
	}
	
}


