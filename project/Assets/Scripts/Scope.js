#pragma strict

public var defenseWave : Wave;
public var hackWave : Wave;
public var resultWave : ResultWave;

public var defenseWaveData : WaveData;
public var hackWaveData : WaveData;

public var waveTypeIconList = new tk2dSprite[4];

public var waveDifList = new float[1000];

public var areaUnderCurve : float;

public var knob : ButtonScript;

public var phaseDial : ButtonScript;

public var activeLight : tk2dSprite;

public var modButtonList = new ButtonScript[4];

public var cannotNullifyLabel : tk2dSprite;

public var drone : Drone;

public var isHacked: boolean;

public var blinkCounter : int = 0;

public var locked : boolean = true;

//public var cover : GameObject;



function initScope()
{

	resultWave.initResultWave();

}



function updateScope()
{
	
}



function updateResultWave()
{

	areaUnderCurve = 0.0;

	//calculate points to be used for result wave
	for( var i = 0; i < Wave.numPoints; i++ )
	{
		
		var startingY : float = 0.0;//SublayerGameDelegate.instance.oscilloscopeCenter.position.y;
	
	
		//shield wave y value
		var e : Vector3 = defenseWaveData.wavePoints[i];
		
		var s : Vector3 = Vector3( e.x, startingY, e.z );//if not being hacked, then assume a flat line
		
		if( hackWaveData != null )
		{
			s = hackWaveData.wavePoints[i];
		}
		
		
		waveDifList[i] = (e.y - startingY) + (s.y - startingY);
	
	
		//add area to total ship damage
		areaUnderCurve += Mathf.Abs( waveDifList[i] );
	
	}

}



function resetScope()
{

	var hackWaveColor : Color = Color( 1.0, 1.0, 1.0, 0.7 );

	hackWave.gameObject.renderer.material.SetColor( "_Color", hackWaveColor );
	hackWave.gameObject.renderer.material.SetColor( "_SpecColor", hackWaveColor );
	hackWave.gameObject.renderer.material.SetColor( "_Emission", hackWaveColor );
	
	var defenseWaveColor : Color = Color( 1.0, 0.94, 0.25, 0.8 );
	
	defenseWave.gameObject.renderer.material.SetColor( "_Color", defenseWaveColor );
	defenseWave.gameObject.renderer.material.SetColor( "_SpecColor", defenseWaveColor );
	defenseWave.gameObject.renderer.material.SetColor( "_Emission", defenseWaveColor );
	
	isHacked = false;
	
	
	//turn on active light
	activeLight.SetSprite( "Interface-Tactical-WaveActiveLightON2" );
	
	
	//default values
	defenseWaveData.waveType = 0;
	
	defenseWaveData.amplitude = 80.0;
	hackWaveData.amplitude = 80.0;
	
	defenseWaveData.waveLengthKnob = Random.Range( 0.1, 1.0 );
	defenseWaveData.phaseKnob = Random.Range( 0.1, 1.0 );
	
	
	//reset wave graphics
	defenseWave.gameObject.SetActive( true );
	hackWave.gameObject.SetActive( true );
	resultWave.gameObject.SetActive( true );
	cannotNullifyLabel.gameObject.SetActive( false );
	
	
	//reset wave icons
	for( var i : int = 0; i < 4; i++ )
	{
		waveTypeIconList[i].gameObject.SetActive( true );
	}
	
	
	//if drone is null, we are in r-scan mode
	//set wave type based on drone type
	if( drone == null )
	{
		defenseWaveData.waveType = 0;
	}
	else if( drone.droneType == Drone.DRONE_MODEL_6611 )
	{
		defenseWaveData.waveType = 0;
	}
	else if( drone.droneType == Drone.DRONE_MODEL_8808 )
	{
		defenseWaveData.waveType = 1;
		defenseWaveData.waveLengthKnob = Random.Range( 0.6, 1.0 );
	}
	else if( Drone.droneNullifiableList[drone.droneType] == false )
	{
		cannotNullifyLabel.gameObject.SetActive( true );
		
		defenseWave.gameObject.SetActive( false );
		hackWave.gameObject.SetActive( false );
		resultWave.gameObject.SetActive( false );
	}
	
	
	//calculate and draw
	defenseWaveData.calculateWave();
	hackWaveData.calculateWave();
	
	defenseWave.updateWave( defenseWaveData );
	hackWave.updateWave( hackWaveData );
	
	updateResultWave();	
	resultWave.drawResultWave();
	
	resetModButtonGraphics();

}



function scopeSuccessfullyHacked()
{

	isHacked = true;

	if( drone != null )
		drone.numScopesHacked++;
	
	
	//turn off active light
	activeLight.SetSprite( "Interface-Tactical-WaveActiveLightOFF" );

	
	//snap phase
	hackWaveData.phaseKnob = defenseWaveData.phaseKnob + 0.5;
	
	
	//wrap phase if needed
	if( hackWaveData.phaseKnob > 1.0 )
	{
	
		hackWaveData.phaseKnob = hackWaveData.phaseKnob - 1.0;
	
	}
	
	
	//snap wavelength
	hackWaveData.waveLengthKnob = defenseWaveData.waveLengthKnob;
	
	
	//set both waves to white
	var hackedWaveColor : Color = Color( 1.0, 1.0, 1.0, 0.7 );
	
	hackWave.gameObject.renderer.material.SetColor( "_Color", hackedWaveColor );
	hackWave.gameObject.renderer.material.SetColor( "_SpecColor", hackedWaveColor );
	hackWave.gameObject.renderer.material.SetColor( "_Emission", hackedWaveColor );
	
	defenseWave.gameObject.renderer.material.SetColor( "_Color", hackedWaveColor );
	defenseWave.gameObject.renderer.material.SetColor( "_SpecColor", hackedWaveColor );
	defenseWave.gameObject.renderer.material.SetColor( "_Emission", hackedWaveColor );
	
	
	//recalculate at end
	hackWaveData.calculateWave();
	defenseWaveData.calculateWave();

	defenseWave.updateWave( defenseWaveData );
	hackWave.updateWave( hackWaveData );
	
	resultWave.gameObject.SetActive( false );

}



function resetModButtonGraphics()
{

	for( var m : int = 0; m < 4; m++ )
	{
	
		if( hackWaveData.waveType == m )
		{
			modButtonList[m].setupButtonGraphics( "Interface-Tactical-ComButtonON2", "Interface-Tactical-ComButtonONpressed" );
		}
		else
		{
			modButtonList[m].setupButtonGraphics( "Interface-Tactical-ComButtonOFF", "Interface-Tactical-ComButtonOFFpressed" );
		}
	
	}

}



function updatePhaseDialGraphics()
{

	var expandedKnobPosition : float = hackWaveData.phaseKnob * 100;
	
	var fileNumber : int = ( expandedKnobPosition % 8 ) + 1;

	var textureFileName : String = "Interface-Tactical-RollerPot" + fileNumber;
	
	var textureId : int = phaseDial.spriteComponent.GetSpriteIdByName( textureFileName );

	phaseDial.spriteComponent.SetSprite( textureId );

}






