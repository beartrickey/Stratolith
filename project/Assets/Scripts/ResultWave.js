#pragma strict


public var mesh : Mesh;

public var outline : LineRenderer;

public var slgd : SublayerGameDelegate;

public var scope : Scope;

function initResultWave()
{

	mesh = gameObject.GetComponent( MeshFilter ).mesh;
	
	slgd = SublayerGameDelegate.instance;
	
}



function drawResultWave( )
{
	
	//clear mesh
	mesh.Clear();
	
	var numVertices : int = Wave.numPoints * 2;
	var numMaxTriangleIndices : int = Wave.numPoints * 6;
	var numNormals : int = Wave.numPoints * 2;
	
	
	//add extra face
	var newVertices = new Vector3[numVertices];
	var newTriangles = new int[numMaxTriangleIndices];
	var newNormals = new Vector3[numNormals];


	//set vertex positions
	for( var i = 0; i < Wave.numPoints; i++ )
	{
		
		var startingY : float = 0.0;//slgd.oscilloscopeCenter.position.y;
		
		var yDif : float = scope.waveDifList[i];
		var xPos : float = scope.defenseWaveData.wavePoints[i].x;

		var direction : float = Mathf.Abs(yDif) / yDif;
		
		var topVert : Vector3 = Vector3( xPos, yDif + startingY + direction, 0.0 );
		var bottomVert : Vector3 = Vector3( xPos, startingY, 0.0 );
		
		var topVertIndex : int = i * 2;
		var bottomVertIndex : int = topVertIndex + 1;
		
		newVertices[topVertIndex] = topVert;
		newVertices[bottomVertIndex] = bottomVert;
		
		
		//also set outline points
		if( outline != null )
		{
			outline.SetPosition( i, Vector3( xPos, yDif + startingY, 0.0 ) );
		}
	
	}
	

	//set triangles
	var numTriangleIndices : int = 0;
	for( var t : int = 0; t < numVertices - 2; t++ )
	{
	
		var v1 : int;
		var v2 : int;
		var v3 : int;
	
		if( t % 2 == 0 )
		{
			v1 = t;
			v2 = t + 2;
			v3 = t + 1;
		}
		else
		{
			v1 = t + 1;
			v2 = t + 2;
			v3 = t;
		}
		
		newTriangles[numTriangleIndices] = v1;
		newTriangles[numTriangleIndices + 1] = v2;
		newTriangles[numTriangleIndices + 2] = v3;
		
		numTriangleIndices += 3;
		
	}
	
		
	//set normals
	for( i = 0; i < numNormals; i++ )
	{
		newNormals[i] = Vector3( 0.0, 0.0, -1.0 );
	}
	
	
	mesh.vertices = newVertices;
	mesh.normals = newNormals;
	mesh.triangles = newTriangles;

}


