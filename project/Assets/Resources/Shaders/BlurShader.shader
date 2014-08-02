Shader "BlurShader"
{

	Properties
	{
	
		blurStrength ( "blurStrength", int ) = 1
		resolution ( "resolution", Range( 0.0, 0.05) ) = 0.0
		_MainTex ("Texture (A = Transparency)", 2D) = ""
		
	}
 
 
	SubShader
	{
	
		Tags{"Queue"="Transparent"}
    	Blend SrcAlpha OneMinusSrcAlpha
	 
	    Pass
	    {
			CGPROGRAM
			#pragma vertex vert_img
			#pragma fragment frag
			#pragma target 3.0
			
			#include "UnityCG.cginc"
			
			int blurStrength;
			float resolution;

			uniform sampler2D _MainTex;

			float4 frag( v2f_img i ) : COLOR
			{
				//float resolution = 0.0075;
				
				float blurResolution = resolution;
				
				float blurFactor = 1.0;
				
				//int blurStrength = 4;
				
				float steps = 1.0;
				
				float4 averageColor = tex2D( _MainTex, i.uv );
				
				if( blurStrength >= 1 )
				{
				
					averageColor += tex2D( _MainTex, float2( i.uv.x - blurResolution, i.uv.y ) ); //west
					averageColor += tex2D( _MainTex, float2( i.uv.x - blurResolution, i.uv.y + blurResolution) ); //northwest
					averageColor += tex2D( _MainTex, float2( i.uv.x, i.uv.y + blurResolution ) ); //north
					averageColor += tex2D( _MainTex, float2( i.uv.x + blurResolution, i.uv.y + blurResolution) ); //northeast
					averageColor += tex2D( _MainTex, float2( i.uv.x + blurResolution, i.uv.y ) ); //east
					averageColor += tex2D( _MainTex, float2( i.uv.x + blurResolution, i.uv.y - blurResolution ) ); //southeast
					averageColor += tex2D( _MainTex, float2( i.uv.x, i.uv.y - blurResolution ) ); //sout
					averageColor += tex2D( _MainTex, float2( i.uv.x - blurResolution, i.uv.y - blurResolution ) ); //southwest
				
					steps += 8.0;
					
				}
				
				if( blurStrength >= 2 )
				{
					blurResolution += resolution;
					blurFactor = 0.5;
				
					averageColor += tex2D( _MainTex, float2( i.uv.x - blurResolution, i.uv.y ) ) * blurFactor; //west
					averageColor += tex2D( _MainTex, float2( i.uv.x - blurResolution, i.uv.y + blurResolution) ) * blurFactor; //northwest
					averageColor += tex2D( _MainTex, float2( i.uv.x, i.uv.y + blurResolution ) ) * blurFactor; //north
					averageColor += tex2D( _MainTex, float2( i.uv.x + blurResolution, i.uv.y + blurResolution) ) * blurFactor; //northeast
					averageColor += tex2D( _MainTex, float2( i.uv.x + blurResolution, i.uv.y ) ) * blurFactor; //east
					averageColor += tex2D( _MainTex, float2( i.uv.x + blurResolution, i.uv.y - blurResolution ) ) * blurFactor; //southeast
					averageColor += tex2D( _MainTex, float2( i.uv.x, i.uv.y - blurResolution ) ) * blurFactor; //sout
					averageColor += tex2D( _MainTex, float2( i.uv.x - blurResolution, i.uv.y - blurResolution ) ) * blurFactor; //southwest
				
					steps += 4.0;
					
				}
				
				
				if( blurStrength >= 3 )
				{
				
					blurResolution += resolution;
					blurFactor = 0.33;
				
					averageColor += tex2D( _MainTex, float2( i.uv.x - blurResolution, i.uv.y ) ) * blurFactor; //west
					averageColor += tex2D( _MainTex, float2( i.uv.x - blurResolution, i.uv.y + blurResolution) ) * blurFactor; //northwest
					averageColor += tex2D( _MainTex, float2( i.uv.x, i.uv.y + blurResolution ) ) * blurFactor; //north
					averageColor += tex2D( _MainTex, float2( i.uv.x + blurResolution, i.uv.y + blurResolution) ) * blurFactor; //northeast
					averageColor += tex2D( _MainTex, float2( i.uv.x + blurResolution, i.uv.y ) ) * blurFactor; //east
					averageColor += tex2D( _MainTex, float2( i.uv.x + blurResolution, i.uv.y - blurResolution ) ) * blurFactor; //southeast
					averageColor += tex2D( _MainTex, float2( i.uv.x, i.uv.y - blurResolution ) ) * blurFactor; //sout
					averageColor += tex2D( _MainTex, float2( i.uv.x - blurResolution, i.uv.y - blurResolution ) ) * blurFactor; //southwest
				
					steps += 2.67;
					
				}
				
				
				if( blurStrength >= 4 )
				{
				
					blurResolution += resolution;
					blurFactor = 0.25;
				
					averageColor += tex2D( _MainTex, float2( i.uv.x - blurResolution, i.uv.y ) ) * blurFactor; //west
					averageColor += tex2D( _MainTex, float2( i.uv.x - blurResolution, i.uv.y + blurResolution) ) * blurFactor; //northwest
					averageColor += tex2D( _MainTex, float2( i.uv.x, i.uv.y + blurResolution ) ) * blurFactor; //north
					averageColor += tex2D( _MainTex, float2( i.uv.x + blurResolution, i.uv.y + blurResolution) ) * blurFactor; //northeast
					averageColor += tex2D( _MainTex, float2( i.uv.x + blurResolution, i.uv.y ) ) * blurFactor; //east
					averageColor += tex2D( _MainTex, float2( i.uv.x + blurResolution, i.uv.y - blurResolution ) ) * blurFactor; //southeast
					averageColor += tex2D( _MainTex, float2( i.uv.x, i.uv.y - blurResolution ) ) * blurFactor; //sout
					averageColor += tex2D( _MainTex, float2( i.uv.x - blurResolution, i.uv.y - blurResolution ) ) * blurFactor; //southwest
				
					steps += 2.0;
					
				}
				
				averageColor /= steps;
				
				averageColor.w = 1.0;
			
				return averageColor;
				
			}
			
			ENDCG
			
    	}
    	
	}
	
}


