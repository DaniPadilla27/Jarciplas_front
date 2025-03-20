import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../../services/api.service';
@Component({
  selector: 'app-detalle-producto',
  standalone: false,
  
  templateUrl: './detalle-producto.component.html',
  styles: ``
})
export class DetalleProductoComponent implements OnInit{

  producto: any;
  cantidad: number = 1;

  constructor(private route: ActivatedRoute, private apiService: ApiService) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.apiService.obtenerProductoPorId(id).subscribe(
      (data) => {
        this.producto = data.producto;
      },
      (error) => {
        console.error('Error al obtener el producto:', error);
      }
    );
  }


}
