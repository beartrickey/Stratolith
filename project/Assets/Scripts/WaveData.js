#pragma strict


public var totalScreenLength : float = 470.0; //length of wave graphic in pixels


//knob positions
public var amplitudeKnob : float = 0.5;
public var waveLengthKnob : float = 0.5;
public var phaseKnob : float = 0.5;


//ranges
public var minAmplitude : float = 0.0;
public var maxAmplitude : float = 200.0;
public var amplitudeRange : float = 200.0;

public var minWaveLength : float = 50.0;
public var maxWaveLength : float = 314.0;
public var waveLengthRange : float = 264.0;

public var minPhase : float = -3.14;
public var maxPhase : float = 3.14;
public var phaseRange : float = Mathf.Abs( minPhase - maxPhase );


//values
public var inputType : int = 0;

public var waveType : int = 0;
public var amplitude : float;
public var waveLength : float;
public var phase : float;

public var subdivisions : int; //how many subdivisions in line graphic (the more divisions the more detailed/smoother the line)

public var wavePoints = new Vector3[Wave.numPoints];



function updateWaveData()
{

	calculateWave();
	
}



function setValuesForKnobPositions()
{

	waveLength = minWaveLength + ( waveLengthRange * waveLengthKnob );
	phase = minPhase + ( phaseRange * phaseKnob );

}



function calculateWave()
{

	setValuesForKnobPositions();

	var startingX : float = 0.0;//SublayerGameDelegate.instance.oscilloscopeCenter.position.x;
	var startingY : float = 0.0;//SublayerGameDelegate.instance.oscilloscopeCenter.position.y;
	
	var numPeriods : float = totalScreenLength / waveLength;
	
	var totalT : float = ( 3.14 * numPeriods );
	
	var startingT : float = totalT * -0.5;
	
	var t : float = startingT + phase;
	
	var tStep : float = totalT / Wave.numPoints;
	
	
	//invert enemy waves
	var invert : float = 1.0;
	
	if( inputType == 1 )
		invert = -1.0;
	
	
	//iterate through line points
	for( var i : int = 0; i < Wave.numPoints; i++ )
	{
	
		//figure out position
		var scaledT : float = ( t - phase ) / ( totalT );
		
		var xpos : float = startingX + ( scaledT * totalScreenLength );
		var ypos : float = 0.0;
		
		var floati : float = i;
		var floatPoints : float = Wave.numPoints;
		var scaledScreenSpaceX : float = floati / floatPoints;
		
		
		var sinWaveY : float = Mathf.Sin( t );
		
		
		//change amplitude for modulations
		var moddedAmplitude = amplitude;
		
		if( waveType == 1 )
		{
		
			var subT : float = t * 3.0;
			var sinVal : float = Mathf.Sin( subT );
			moddedAmplitude *= sinVal * invert;
		
		}
		
		
		//wave types
		if( waveType == 0 ) //sine
		{
		
			ypos = startingY + ( sinWaveY * moddedAmplitude );
			
		}
		else if( waveType == 1 ) //M W wave
		{
			
			if( sinWaveY < 0.0 )
				ypos = startingY - moddedAmplitude;
			else if( sinWaveY > 0.0 )
				ypos = startingY + moddedAmplitude;
				
		}
		else if( waveType == 2 ) //flat line
		{
			var triangleOutput : float = Mathf.Abs( 2.0 * ( ((t+1.57) / 6.28) - Mathf.Floor(((t+1.57) / 6.28) + 0.5) ) );
			
			//ypos = Mathf.Abs( 2 * ((t / 3.14) - Mathf.Floor((t / 3.14) + 0.5)) ) * amplitude * 2.0; //old
			ypos = triangleOutput * moddedAmplitude * 2.0;
			
			ypos += startingY - moddedAmplitude;
			
		}
		else if( waveType == 3 ) //stretch
		{
			
			var modWave : float = 6.14 * scaledScreenSpaceX;
			modWave -= 3.14;
			modWave = Mathf.Sin(modWave);
			var stretchSinWaveY : float = Mathf.Sin( modWave );
			
			ypos = startingY + ( stretchSinWaveY * moddedAmplitude );
			
		}
	
		
		//make position
		var position : Vector3 = Vector3( xpos, ypos, 0.0 );
		
		
		//store points to be used by result wave
		wavePoints[i] = position;
		
		
		//increment t
		t += tStep;
	
	}

}


