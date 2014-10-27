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

	var startingX : float = 0.0;
	var startingY : float = 0.0;
	
	var numPeriods : float = totalScreenLength / waveLength;
	
	var totalT : float = ( 3.14 * numPeriods );
	
	var startingT : float = totalT * -0.5;
	
	var t : float = startingT + phase;
	
	var tStep : float = totalT / Wave.numPoints;
	
	
	//iterate through line points
	for( var i : int = 0; i < Wave.numPoints; i++ )
	{
	
		//figure out position
		var scaledT : float = ( t - phase ) / ( totalT );
		
		var xpos : float = startingX + ( scaledT * totalScreenLength );
		var ypos : float = 0.0;
		
		
		var sinWaveY : float = Mathf.Sin( t );
		
		
		//change amplitude for modulations
		var moddedAmplitude = amplitude;
		
		
		// Wave types
		if( waveType == 0 ) // Sine
		{
		
			ypos = startingY + ( sinWaveY * moddedAmplitude );
			
		}
		else if( waveType == 1 ) // M W wave
		{

			ypos = startingY + ( sinWaveY * moddedAmplitude );

			var offset : float = 0.0;
			var amplitudeOffset : float = 0.0;
			var strength : float = 0.0;

			if( sinWaveY > 0.5 )
			{
				offset = sinWaveY - 0.5;
				strength = (offset / 0.5) * 1.5;
				amplitudeOffset = offset * moddedAmplitude * strength;
				ypos -= amplitudeOffset;
			}
			else if( sinWaveY < -0.5 )
			{
				offset = -sinWaveY - 0.5;
				strength = (offset / 0.5) * 1.5;
				amplitudeOffset = offset * moddedAmplitude * strength;
				ypos += amplitudeOffset;
			}
				
		}
		else if( waveType == 2 ) // Flat line
		{

			ypos = startingY + ( sinWaveY * moddedAmplitude );

			var currentPeriod : float = Mathf.Floor( t / 6.28 );
			var tOffset : float = t - (currentPeriod * 6.28);
			var startEffect : float = 2.0;//3.14;
			var endEffect : float = 5.5;//4.71;
			var effectLength : float = endEffect - startEffect;

			if( tOffset > startEffect && tOffset < endEffect )
			{
				var normalizedEffect : float = (tOffset - startEffect) / effectLength;
				strength = (Mathf.Cos( normalizedEffect * 6.28 ) * 0.5) - 0.5;

				ypos -= ( sinWaveY * moddedAmplitude * -strength);
			}
			
		}
		else if( waveType == 3 ) //stretch
		{
			
			
		}
	
		
		//make position
		var position : Vector3 = Vector3( xpos, ypos, 0.0 );
		
		
		//store points to be used by result wave
		wavePoints[i] = position;
		
		
		//increment t
		t += tStep;
	
	}

}


