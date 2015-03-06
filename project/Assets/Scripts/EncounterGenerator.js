#pragma strict

public var slgd : SublayerGameDelegate = null;

// Cycle
public var cycleCounter : int = 0;

// Cycle Tension
public var cycleTensionLevel : float = 0.5;
public static var tensionStep : float = 0.1;

// Encounter stats
public var encounterCounter : int = 0;
public var encountersPerCycle : int = 3;
public var encounterTension : float = 0.0;

// How much damage can a player take before we consider an encounter "failed"
public static var damageThreshold : float = 50.0;

// Timer
public static var timeBetweenEncounters : int = 60 * 60 * 2;
public static var encounterTimer : int = 0;


function getPlayerPower()
{

	return slgd.mainPower + slgd.getNullifiedDroneTotalPower();

}


function encounterGeneratorUpdate()
{

	// Limit max drone count
	// Limit number of drones that appear at a time
	// Limit encounters per time period (Easiest level is 1 encounter every 3 minutes?)
	// Limit number of unhackable drones that appear

	////////////////////////////////
	// Handle encounter counter
	////////////////////////////////
	encounterTimer--;

	if( encounterTimer > 0 )
		return;


	// Limit encounters per time period (Easiest level is 1 encounter every 3 minutes?)
	// Limit number of unhackable drones that appear
	encounterTimer = timeBetweenEncounters;
	encounterCounter++;

	// Reset cycle
	if( encounterCounter > encountersPerCycle )
	{
		cycleCounter++;
		encounterCounter = 0;

		cycleTensionLevel += 0.1;

		encounterTension = 0.0;
	}

	// Increase tension as cycle progresses
	if( encounterCounter != 0 )
	{
		encounterTension = cycleTensionLevel * encounterTension;
	}

	////////////////////////////////////////////////////////////////
	// Limit max drone count
	// Limit number of drones that appear at a time
	////////////////////////////////////////////////////////////////
	var maximumPossibleDronesOnScreen : int = PlayerData.instance.scopeLevel + 3; // Between 4 and 6
	var maximumPossibleDronesThisEncounter : int = maximumPossibleDronesOnScreen - slgd.getNullifiedDroneCount();

	// Reduce based on tension
	var playerDronePower : int = Mathf.Ceil(slgd.getNullifiedDroneTotalPower());
	var hostileDronePower : int = playerDronePower * encounterTension;

	// If no null drones, send drone appropriate to player level
	if( playerDronePower == 0.0 )
	{
		hostileDronePower = cycleCounter * 10.0;
	}

	var numGeneratedDrones : int = Random.Range(1, maximumPossibleDronesThisEncounter + 1);
	var generatedDronePowerLevel : int = Mathf.Ceil(playerDronePower / numGeneratedDrones);

	for( var i : int = 0; i < numGeneratedDrones; i++ )
	{
		var randDirection : float = Random.Range(0.0, 6.28);

		var position : Vector2 = Vector2(
			Mathf.Sin(randDirection) * slgd.scannerWidth,
			Mathf.Cos(randDirection) * slgd.scannerWidth
		);
		position += slgd.stratolithWorldPosition;


		// Instantiate drone object
		var drone : Drone = slgd.makeNewDrone( position );


		// Hackable or not?
		var randHackable : int = Random.Range(0, 2);


		// If player has no hacked drones, give them one
		if( slgd.getNullifiedDroneCount() == 0 )
			randHackable = 1;


		// If player has max null drone count, give them a non-hackable one
		var maxNullDroneCount : int = PlayerData.instance.dockLevel + 2;
		if( slgd.getNullifiedDroneCount() >=  maxNullDroneCount )
			randHackable = 0;

		// Drone stats
		drone.initRandomDrone(generatedDronePowerLevel);
	}

}

