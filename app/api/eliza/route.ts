import { NextResponse } from "next/server";
import { getElizaService } from "@/lib/eliza-service";

/**
 * ElizaOS Health Check and Status Endpoint
 * GET /api/eliza
 */
export async function GET() {
  try {
    const elizaService = getElizaService();
    
    return NextResponse.json({
      success: true,
      initialized: elizaService.isInitialized(),
      timestamp: new Date().toISOString(),
      message: elizaService.isInitialized() 
        ? "ElizaOS service is running" 
        : "ElizaOS service is not initialized"
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

/**
 * Initialize ElizaOS Service
 * POST /api/eliza
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const action = body.action;

    const elizaService = getElizaService();

    switch (action) {
      case "initialize":
        if (elizaService.isInitialized()) {
          return NextResponse.json({
            success: true,
            message: "ElizaOS service already initialized",
            timestamp: new Date().toISOString()
          });
        }

        await elizaService.initialize();
        
        return NextResponse.json({
          success: true,
          message: "ElizaOS service initialized successfully",
          timestamp: new Date().toISOString()
        });

      case "shutdown":
        await elizaService.shutdown();
        
        return NextResponse.json({
          success: true,
          message: "ElizaOS service shutdown successfully",
          timestamp: new Date().toISOString()
        });

      case "cast":
        if (!elizaService.isInitialized()) {
          return NextResponse.json(
            {
              success: false,
              error: "ElizaOS service not initialized. Call initialize first."
            },
            { status: 400 }
          );
        }

        const { text, parentHash } = body;
        
        if (!text) {
          return NextResponse.json(
            { success: false, error: "Missing 'text' field" },
            { status: 400 }
          );
        }

        const result = await elizaService.postCast(text, { parentHash });
        
        return NextResponse.json({
          success: true,
          result,
          timestamp: new Date().toISOString()
        });

      default:
        return NextResponse.json(
          {
            success: false,
            error: `Unknown action: ${action}. Valid actions: initialize, shutdown, cast`
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("[ElizaOS API] Error:", error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
