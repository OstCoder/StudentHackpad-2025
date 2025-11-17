import { useRef, useState, useEffect } from 'react';
import { Brush, Download, Trash2, Palette } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { toast } from 'sonner';

interface DrawingCanvasProps {
  onSave: (dataUrl: string) => void;
}

export const DrawingCanvas = ({ onSave }: DrawingCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#7c3aed');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [lastPoint, setLastPoint] = useState<{ x: number; y: number } | null>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    
    // Set white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);
  
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setIsDrawing(true);
    setLastPoint({ x, y });
  };
  
  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !lastPoint) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(x, y);
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    
    setLastPoint({ x, y });
  };
  
  const stopDrawing = () => {
    setIsDrawing(false);
    setLastPoint(null);
  };
  
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };
  
  const saveDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const dataUrl = canvas.toDataURL('image/png');
    onSave(dataUrl);
    
    // Show save animation
    toast.success('Drawing saved!', {
      icon: '🎨',
      duration: 2000,
    });
  };
  
  const downloadDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `drawing-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  };
  
  return (
    <Card className="p-6 glass">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Brush className="w-5 h-5 text-primary" />
          Drawing Canvas
        </h3>
        
        <div className="flex gap-2">
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="gap-2"
            >
              <Palette className="w-4 h-4" />
              <div
                className="w-4 h-4 rounded border border-border"
                style={{ backgroundColor: color }}
              />
            </Button>
            
            {showColorPicker && (
              <div className="absolute top-full right-0 mt-2 p-3 bg-card border border-border rounded-lg shadow-lg z-10">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-32 h-32 cursor-pointer"
                />
              </div>
            )}
          </div>
          
          <Button variant="outline" size="sm" onClick={clearCanvas}>
            <Trash2 className="w-4 h-4" />
          </Button>
          
          <Button variant="outline" size="sm" onClick={downloadDrawing}>
            <Download className="w-4 h-4" />
          </Button>
          
          <Button
            size="sm"
            onClick={saveDrawing}
            className="bg-gradient-primary"
          >
            Save
          </Button>
        </div>
      </div>
      
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        className="w-full h-96 border-2 border-border rounded-lg cursor-crosshair bg-white"
      />
    </Card>
  );
};
