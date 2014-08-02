#pragma strict


public var lr : LineRenderer;
public static var numPoints : int = 250;


function Start()
{

	//cache LineRenderer
	lr = gameObject.GetComponent( LineRenderer );

}



function updateWave( _waveData : WaveData )
{

	drawWave( _waveData );
	
}



function drawWave( _waveData : WaveData )
{
	
	//iterate through line points
	for( var i = 0; i < numPoints; i++ )
	{
	
		//set line point
		lr.SetPosition( i, _waveData.wavePoints[i] );
	
	}

}



