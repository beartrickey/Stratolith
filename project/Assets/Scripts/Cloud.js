#pragma strict


public var mesh : Mesh;

public var myCollider : MeshCollider;

public var outline : LineRenderer;

public var slgd : SublayerGameDelegate;

public static var numPoints : int = 50;

static var radius : float = 100.0;

static var arcWidth : float = 6.28 / numPoints;

public var heightMapList = new float[numPoints];

function Start()
{

	mesh = gameObject.GetComponent( MeshFilter ).mesh;

	outline = gameObject.GetComponent( LineRenderer );

	myCollider = gameObject.GetComponent( MeshCollider );

	// myCollider.OnCollisionEnter = cloudCollision;
	
	// slgd = SublayerGameDelegate.instance;

	//randomly generate heights
	for( var p : int = 0; p < numPoints; p++ )
	{
		
		var range : float = 10.0;
		
		var randomHeightOffset : float = Random.Range( -range, range );
		
		var height : float = radius + randomHeightOffset;
		
		heightMapList[p] = height;
		
	}
	
	arrangeVerts();
	
}



function arrangeVerts()
{
	
	//make new vert and tri arrays
	var numVerts : int = numPoints + 1; //outside verts plus one in center
	var numTris : int = numPoints * 3;
	
	var newVertices = new Vector3[numVerts];
	var newTriangles = new int[numTris];
	
	
	newVertices[0] = Vector3( 0.0, 0.0, 0.0 ); //first vertex is at center of planet
	
	
	//set vertex positions
	for( var p : int = 1; p < numVerts; p++ )
	{
	
		var t = p * arcWidth;
	
		var xPos : float = Mathf.Cos( t ) * heightMapList[p - 1];
		var yPos : float = Mathf.Sin( t ) * heightMapList[p - 1];
		newVertices[p] = Vector3( xPos, yPos, 0.0 );
		
	}	
	
	
	//set triangles
	for( var triangle : int = 0; triangle < numPoints; triangle++ )
	{
		
		var startingTriIndex : int = triangle * 3;
		
		if( triangle == numPoints - 1 ) //special index for last triangle
		{
			newTriangles[startingTriIndex] = 0;
			newTriangles[startingTriIndex + 1] = triangle + 1;
			newTriangles[startingTriIndex + 2] = 1;
			
		}
		else
		{
			newTriangles[startingTriIndex] = 0;
			newTriangles[startingTriIndex + 1] = triangle + 1;
			newTriangles[startingTriIndex + 2] = triangle + 2;
		}
		
		
	}
	
	//clear mesh
	mesh.Clear();
	
	
	//set verts
	mesh.vertices = newVertices;
	mesh.triangles = newTriangles;
	mesh.RecalculateBounds();

	// Use this mesh for the collider
	myCollider.sharedMesh.Clear();
	myCollider.sharedMesh = mesh;

}

